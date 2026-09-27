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

# Import your database model
from .models import Scan 

load_dotenv()

@api_view(['POST'])
def analyze_url(request):
    # 1. Define raw_url at the very beginning
    raw_url = request.data.get('url', '').strip()
    
    if not raw_url:
        return Response({"error": "No URL provided."}, status=status.HTTP_400_BAD_REQUEST)

    # Automatically append https:// if missing
    if not raw_url.startswith(('http://', 'https://')):
        raw_url = 'https://' + raw_url

    # 2. Format Validation
    validator = URLValidator()
    try:
        validator(raw_url)
    except ValidationError:
        return Response({"error": "Invalid URL format. Please enter a real web address."}, status=status.HTTP_400_BAD_REQUEST)

    # 3. DNS Verification
    try:
        domain = urlparse(raw_url).netloc
        socket.gethostbyname(domain)
    except socket.gaierror:
        return Response({"error": f"The website '{domain}' does not exist or is offline."}, status=status.HTTP_404_NOT_FOUND)

    # 4. API Scraping
    try:
        base_api_url = os.getenv('META_API_URL', 'https://api.microlink.io')
        api_endpoint = f"{base_api_url}?url={raw_url}"
        
        response = requests.get(api_endpoint, timeout=10)
        
        if response.status_code != 200:
            return Response({"error": "Website found, but could not be scraped."}, status=status.HTTP_400_BAD_REQUEST)
            
        json_data = response.json().get('data', {})

        extracted_data = {
            "url": raw_url,
            "title": json_data.get("title", ""),
            "description": json_data.get("description", ""),
            "image": json_data.get("image", {}).get("url", "") if json_data.get("image") else "",
            # NEW: Extracting real AEO & GEO signals from the API
            "author": json_data.get("author", "") or json_data.get("publisher", ""),
            "language": json_data.get("lang", ""),
            "schema": True if json_data.get("logo") or json_data.get("publisher") else False
        }
        
        # Save valid scans to SQLite
        Scan.objects.create(url=raw_url)
        
        return Response(extracted_data, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException:
        return Response({"error": "Failed to connect to the analysis server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def recent_scans(request):
    # Fetch the 5 most recent scans from the database
    latest_scans = Scan.objects.order_by('-scanned_at')[:5]
    data = [{"url": scan.url} for scan in latest_scans]
    return Response(data, status=status.HTTP_200_OK)