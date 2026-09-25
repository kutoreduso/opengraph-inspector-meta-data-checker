from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import requests
import os
from dotenv import load_dotenv

# Load the variables from the .env file
load_dotenv()

@api_view(['POST'])
def analyze_url(request):
    url = request.data.get('url')
    
    if not url:
        return Response({"error": "No URL provided"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Securely fetch the API URL from your .env file
        base_api_url = os.getenv('META_API_URL', 'https://api.microlink.io')
        api_endpoint = f"{base_api_url}?url={url}"
        
        # If using an API key later, you can pass it in headers:
        # api_key = os.getenv('META_API_KEY')
        # headers = {'Authorization': f'Bearer {api_key}'}
        # response = requests.get(api_endpoint, headers=headers, timeout=10)

        response = requests.get(api_endpoint, timeout=10)
        
        if response.status_code != 200:
            return Response({"error": "Could not fetch data for this URL."}, status=status.HTTP_400_BAD_REQUEST)
            
        json_data = response.json().get('data', {})

        extracted_data = {
            "url": url,
            "title": json_data.get("title", ""),
            "description": json_data.get("description", ""),
            "image": json_data.get("image", {}).get("url", "") if json_data.get("image") else ""
        }
        
        return Response(extracted_data, status=status.HTTP_200_OK)

    except requests.exceptions.RequestException:
        return Response({"error": "Failed to connect to the scraping API."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)