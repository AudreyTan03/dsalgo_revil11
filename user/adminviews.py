from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser


from .models import User
from videos.models import Video, Subscription
from base.models import Product
from .serializers import UserSerializer
from base.serializers import AdminProductSerializer
from videos.serializers import AdminVideoSerializer, SubscriptionSerializer
from django.shortcuts import get_object_or_404


class adminpanelUsers(APIView):
    permission_classes = [IsAdminUser]  # admin lang pwede

    def get(self, request, user_id=None):  
        try:
            if user_id is not None: # pag may user id na binigay (userdetail)
                user = User.objects.get(id=user_id) 
                products = Product.objects.filter(user=user)  
                user_data = UserSerializer(user).data
                product_data = AdminProductSerializer(products, many=True).data
                user_data['products'] = product_data  
                return Response(user_data, status=status.HTTP_200_OK)
            else:
                users = User.objects.all() #userlist
                serializer = UserSerializer(users, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def put(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserSerializer(user, data=request.data, partial=True)  # Allow partial updates
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'User details updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            user.delete()
            return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class adminpanelProducts(APIView):
    permission_classes = [IsAdminUser]
    parser_classes = (MultiPartParser, FormParser,) 


    def get(self, request, product_id=None):
        try:
            if product_id is not None:
                product = get_object_or_404(Product, pk=product_id)
                serializer = AdminProductSerializer(product)
                data = serializer.data
                user_name = product.user.name if product.user else None
                data['user_name'] = user_name  
                return Response(data, status=status.HTTP_200_OK)
            else:
                products = Product.objects.all()
                serializer = AdminProductSerializer(products, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, product_id):
        try:
            product = get_object_or_404(Product, pk=product_id)
            serializer = AdminProductSerializer(product, data=request.data, partial=True)
            if serializer.is_valid():
                # Check if preview_video and image are provided in the request data
                if 'preview_video' not in request.data:
                    serializer.fields.pop('preview_video', None)
                if 'image' not in request.data:
                    serializer.fields.pop('image', None)
                serializer.save()
                return Response({'message': 'Product details updated successfully'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def delete(self, request, product_id):
        try:
            product = Product.objects.get(_id=product_id)  # Use _id instead of id
            product.delete()
            return Response({'message': 'Product deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   


class adminpanelVideos(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request, video_id=None):
        try:
            if video_id is not None:
                video = get_object_or_404(Video, pk=video_id)
                serializer = AdminVideoSerializer(video)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                videos = Video.objects.all()
                serializer = AdminVideoSerializer(videos, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, video_id):
        try:
            video = get_object_or_404(Video, pk=video_id)
            serializer = AdminVideoSerializer(video, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Video details updated successfully'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, video_id):
        try:
            video = get_object_or_404(Video, pk=video_id)
            video.delete()
            return Response({'message': 'Video deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class adminpanelSubscriptions(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        try:
            subscriptions = Subscription.objects.all()
            serializer = SubscriptionSerializer(subscriptions, many=True)
            data = serializer.data
            for sub in data:
                user = User.objects.get(pk=sub['user'])
                product = Product.objects.get(pk=sub['product'])
                sub['user_name'] = user.name
                sub['product_name'] = product.name
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def delete(self, request, subscription_id):
        try:
            subscription = get_object_or_404(Subscription, pk=subscription_id)
            subscription.delete()
            return Response({'message': 'Subscription deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)