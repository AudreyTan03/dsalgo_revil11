from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from rest_framework.response import Response
from .models import *
from .serializers import DeleteVideoSerializer, QuestionSerializer, VideoSerializer, VideoDetailSerializer, SubscriptionSerializer, UploadVideoSerializer
from base.models import Order, Product

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Video
from .serializers import VideoSerializer
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def get_video(request, video_id):
    video = get_object_or_404(Video, pk=video_id)
    serializer = VideoSerializer(video)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_videos(request):
    videos = Video.objects.all()
    serializer = VideoSerializer(videos, many=True)
    return Response(serializer.data)

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
def get_product_video(request, product_id, video_id):
    try:
        video = get_object_or_404(Video, id=video_id, product_id=product_id)
        serializer = VideoDetailSerializer(video)
        return Response(serializer.data)
    except Video.DoesNotExist:
        return Response({'detail': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)


# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def subscribe_to_product(request, product_id):
#     product = get_object_or_404(Product, pk=product_id)
#     # Prevent duplicate subscriptions
#     if Subscription.objects.filter(user=request.user, product=product).exists():
#         return Response({"error": "You are already subscribed to this product."}, status=400)
#     Subscription.objects.create(user=request.user, product=product)
#     return Response({"message": "Successfully subscribed."}, status=201)

@api_view(['GET'])
def check_subscription(request,user_id, product_id):
    # Assuming the user is authenticated, you can access the user object via request.user
    user = User.objects.get(pk=user_id)

    # Retrieve the product based on the product_id
    product = Product.objects.get(pk=product_id)

    # Check if the user is subscribed to the product
    is_subscribed = Subscription.objects.filter(user=user, product=product).exists()

    # Return the subscription status in the response
    return Response({'isUserSubscribed': is_subscribed})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orderVideos(request, order_id):
    try:
        order = Order.objects.get(id=order_id)
        product = order.product

        # Check if the product has associated videos
        if product:
            videos = Video.objects.filter(product=product)
            serializer = VideoSerializer(videos, many=True)
            return Response(serializer.data)
        else:
            return Response({'detail': 'No videos found for the specified order'}, status=status.HTTP_404_NOT_FOUND)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['GET'])
def listQuestionForVid(request, video_id):
    video = get_object_or_404(Video, pk=video_id)
    questions = Question.objects.filter(video=video)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postQuestion(request, video_id):
    video = get_object_or_404(Video, pk=video_id)
    serializer = QuestionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(video=video, user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def postReply(request, question_id):
    question = get_object_or_404(Question, pk=question_id)
    if question.video.product.user != request.user:
        return Response({'error': 'You are not authorized to reply to this question'}, status=status.HTTP_403_FORBIDDEN)
    serializer = QuestionSerializer(question, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save(reply=request.data['reply'])
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


