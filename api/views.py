from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import requests
import os
import socket
from urllib.parse import urlparse
from dotenv import load_dotenv

from .models import Scan

load_dotenv()

# --- STRICT FILE VALIDATION HELPER ---
def verify_file_exists(url, required_type):
    try:
        # We use GET to actually read the headers, allowing redirects (e.g., http to https)
        response = requests.get(url, timeout=4, stream=True)
        
        if response.status_code == 200:
            content_type = response.headers.get('Content-Type', '').lower()
            
            # Reject "Soft 404s": If the server returns an HTML webpage, it is a fake success.
            if 'text/html' in content_type:
                return False
                
            # Check if it matches the exact MIME type we expect
            if required_type in content_type:
                return True
                
            # Ultimate Fallback: If the server forgot to set a Content-Type, check the actual text
            # We only read the first 100 bytes to keep it extremely fast
            first_bytes = next(response.iter_content(chunk_size=100), b'').decode('utf-8', errors='ignore').lower()
            if required_type == 'xml' and ('<?xml' in first_bytes or '<urlset' in first_bytes):
                return True
            if required_type == 'plain' and ('user-agent:' in first_bytes or 'disallow:' in first_bytes):
                return True
                
        return False
    except requests.exceptions.RequestException:
        return False


@api_view(['POST'])
def analyze_url(request):
    raw_url = request.data.get('url', '').strip()
    
    if not raw_url:
        return Response({"error": "No URL provided."}, status=status.HTTP_400_BAD_REQUEST)

    if not raw_url.startswith(('http://', 'https://')):
        raw_url = 'https://' + raw_url

    validator = URLValidator()
    try:
        validator(raw_url)
    except ValidationError:
        return Response({"error": "Invalid URL format. Please enter a valid web address."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        domain = urlparse(raw_url).netloc
        socket.gethostbyname(domain)
    except socket.gaierror:
        return Response({"error": f"The website '{domain}' does not exist or is offline."}, status=status.HTTP_404_NOT_FOUND)

    try:
        base_api_url = os.getenv('META_API_URL', 'https://api.microlink.io')
        
        response = requests.get(base_api_url, params={'url': raw_url}, timeout=12)
        
        if response.status_code != 200:
            error_details = response.json().get('message', 'External scraper failed')
            return Response(
                {"error": f"Could not scrape target URL: {error_details}"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        json_data = response.json().get('data', {})

        # --- RUN THE STRICT FILE CHECKS ---
        parsed_url = urlparse(raw_url)
        base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"
        
        has_robots = verify_file_exists(f"{base_domain}/robots.txt", "plain")
        has_sitemap = verify_file_exists(f"{base_domain}/sitemap.xml", "xml")

        extracted_data = {
            "url": raw_url,
            "title": json_data.get("title", ""),
            "description": json_data.get("description", ""),
            "image": json_data.get("image", {}).get("url", "") if json_data.get("image") else "",
            "author": json_data.get("author", "") or json_data.get("publisher", ""),
            "language": json_data.get("lang", ""),
            "schema": True if json_data.get("logo") or json_data.get("publisher") else False,
            "robots": has_robots,     
            "sitemap": has_sitemap    
        }
        
        Scan.objects.create(url=raw_url)
        
        return Response(extracted_data, status=status.HTTP_200_OK)

    except requests.exceptions.Timeout:
        return Response({"error": "The target website took too long to respond."}, status=status.HTTP_504_GATEWAY_TIMEOUT)
    except requests.exceptions.RequestException as e:
        return Response({"error": "Failed to connect to the analysis server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def recent_scans(request):
    latest_scans = Scan.objects.order_by('-scanned_at')[:5]
    data = [{"url": scan.url} for scan in latest_scans]
    return Response(data, status=status.HTTP_200_OK)