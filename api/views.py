from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import time


# Create your views here.
@api_view(['POST'])
def analyze_url(request):
    url = request.data.get('url')

    if not url:
        return Response({"error": "No Url provided"}, status=status.HTTP_400_BAD_REQUEST)

        TODO
    time.sleep(2)

    mock_scraped_data = {
        "url": url,
        "title": "Example Domain Title",
        "description": "This is a mock description extracted from the meta tags.",
        "image": "https://via.placeholder.com/800x400",
        "score": 85
    }

    return Response(mock_scraped_data, status=status.HTTP_200_OK)

