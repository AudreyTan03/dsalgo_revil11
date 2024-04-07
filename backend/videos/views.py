from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import DeleteVideoSerializer, VideoSerializer, SubscriptionSerializer, UploadVideoSerializer
from base.models import Product

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def uploadProductVideo(request):
    if not request.user.is_instructor:
        return Response({'error': 'Only instructors can upload videos for courses'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UploadVideoSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()  
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def deleteVideo(request):
    if not request.user.is_instructor:
        return Response({'error': 'You are not an instructor'}, status=status.HTTP_403_FORBIDDEN)

    serializer = DeleteVideoSerializer(data=request.data)
    if serializer.is_valid():
        product_id = serializer.validated_data['product_id']
        try:
            product = Product.objects.get(pk=product_id)
            if product.user != request.user: 
                return Response({'error': 'You are not authorized to delete this product'}, status=status.HTTP_403_FORBIDDEN)
            product.delete()
            return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listProductVideos(request, product_id): # lilista lahat ng vids sa isang course
    try:
        videos = Video.objects.filter(product_id=product_id)
        serializer = VideoSerializer(videos, many=True, context={'request': request})  # Pass request object to serializer context
        return Response(serializer.data)
    except Video.DoesNotExist:
        return Response({'detail': 'No videos found for the specified product'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProductVideo(request, product_id, video_id):
    try:
        video = Video.objects.get(pk=video_id, product_id=product_id)
        
        if video.is_accessible(request.user):
            serializer = VideoSerializer(video)
            return Response(serializer.data)
        else:
            return Response({"error": "You must be subscribed to access this video."}, status=status.HTTP_403_FORBIDDEN)
    
    except Video.DoesNotExist:
        return Response({'detail': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def subscribe_to_course(request, product_id):
    try:
        # Retrieve the product/course object
        product = Product.objects.get(pk=product_id)
        
        # Check if the user is already subscribed to the course
        if Subscription.objects.filter(user=request.user, product=product).exists():
            return Response({"error": "You are already subscribed to this course."}, status=400)
        
        # Create a new subscription for the user and the course
        subscription = Subscription.objects.create(user=request.user, product=product)
        
        # Serialize the subscription data
        serializer = SubscriptionSerializer(subscription)
        
        # Return the serialized subscription data with a success message
        return Response({"message": "Successfully subscribed to the course.", "subscription": serializer.data}, status=201)
    
    except Product.DoesNotExist:
        return Response({"error": "Course not found."}, status=404)