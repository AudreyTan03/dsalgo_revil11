from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from django.core.exceptions import ValidationError
from videos.serializers import AdminVideoSerializer, VideoSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields =['id','name','email']


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

# def validate_image(file):
#     # Validate file size, type, etc.
#     if not file.name.endswith(('.png', '.jpg', '.jpeg')):
#         raise ValidationError('Unsupported file type.')
#     # Add more validations as needed
# def validate_video(file):
#     # Validate file size, type, etc.
#     if not file.name.endswith('.mp4'):
#         raise ValidationError('Unsupported file type. Only MP4 videos are allowed.')
#     # Add more validations as needed (e.g., file size)

class ProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_user_name(self, obj):
        return obj.user.name if obj.user else 'Unknown'

    # def validate_image(self, value):
    #     validate_image(value)
    #     return value
    
    # def validate_preview_video(self, value):
    #     validate_video(value)
    #     return value


class UploadProductSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField(read_only=True)
    product_videos = VideoSerializer(many=True, read_only=True)  

    class Meta:
        model = Product
        fields = '__all__'

    def get_user_name(self, obj):
        return obj.user.name if obj.user else 'Unknown'


class AdminProductSerializer(serializers.ModelSerializer):
    product_videos = AdminVideoSerializer(many=True, read_only=True)
    
    class Meta:
        model = Product
        fields ='__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    # id=serializers.SerializerMethodField(source='_id',read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
    
    def get_orderItems(self, obj):
        items = obj.order_items.all()  # Corrected related name
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data
    
    def get_user(self, obj):
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
    
class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = '__all__'


