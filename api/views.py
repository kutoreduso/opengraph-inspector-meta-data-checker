from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import requests
import os
import socket  # Added for DNS checking
from urllib.parse import urlparse  # Added for parsing the domain
from dotenv import load_dotenv
from .models import Scan
load_dotenv()


@api_view(['POST'])

def analyze_url(request):
    Scan.objects.create(url=raw_url)
    raw_url = request.data.get('url', '').strip()
    
    if not raw_url:
        return Response({"error": "No URL provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Automatically append https:// if the user forgets it
    if not raw_url.startswith(('http://', 'https://')):
        raw_url = 'https://' + raw_url

    # 1. Strict URL Format Validation
    validator = URLValidator()
    try:
        validator(raw_url)
    except ValidationError:
        return Response({"error": "Invalid URL format. Please enter a real web address."}, status=status.HTTP_400_BAD_REQUEST)

    # 2. DNS Verification (Does the domain actually exist on the internet?)
    try:
        domain = urlparse(raw_url).netloc
        socket.gethostbyname(domain)
    except socket.gaierror:
        # If the domain has no IP address, it doesn't exist. Stop here.
        return Response({"error": f"The website '{domain}' does not exist or is offline."}, status=status.HTTP_404_NOT_FOUND)

    # 3. If it exists, proceed with scraping
    try:
        base_api_url = os.getenv('META_API_URL', 'https://api.microlink.io')
        api_endpoint = f"{base_api_url}?url={raw_url}"
        
        response = requests.get(api_endpoint, timeout=10)
        
        if response.status_code != 200:
            return Response({"error": "Website found, but could not be scraped. It may be blocking bots."}, status=status.HTTP_400_BAD_REQUEST)
            
        json_data = response.json().get('data', {})

        # Microlink fallback protection: If the title is EXACTLY the domain name and there's no description/image, it's a failed scrape
        title = json_data.get("title", "")
        desc = json_data.get("description", "")
        img = json_data.get("image", {}).get("url", "") if json_data.get("image") else ""

        extracted_data = {
            "url": raw_url,
            "title": title,
            "description": desc,
            "image": img
        }
        
        return Response(extracted_data, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException:
        return Response({"error": "Failed to connect to the analysis server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def recent_scans(request):
    latest_scan = Scan.objects.order.by('-scanned_at')[:5]
    data = [{"url": scan.url} for scan in latest_scan]
    return Response(data, status=status.HTTP_200_OK)