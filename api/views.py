from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError
import requests
import os
from dotenv import load_dotenv

load_dotenv()

@api_view(['POST'])
def analyze_url(request):
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
        return Response({"error": "Invalid URL format. Please enter a real web address (e.g., example.com)."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        base_api_url = os.getenv('META_API_URL', 'https://api.microlink.io')
        api_endpoint = f"{base_api_url}?url={raw_url}"
        
        response = requests.get(api_endpoint, timeout=10)
        
        # 2. Check if the external API actually found the website
        if response.status_code != 200:
            return Response({"error": "Website not found or could not be reached. Ensure the site is live."}, status=status.HTTP_404_NOT_FOUND)
            
        json_data = response.json().get('data', {})

        extracted_data = {
            "url": raw_url,
            "title": json_data.get("title", ""),
            "description": json_data.get("description", ""),
            "image": json_data.get("image", {}).get("url", "") if json_data.get("image") else ""
        }
        
        return Response(extracted_data, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException:
        return Response({"error": "Failed to connect to the analysis server."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)