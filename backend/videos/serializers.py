from rest_framework import serializers
from .models import *
from user.serializers import *


class AdminVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class UploadVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class VideoDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        user = request.user if request else None
        
        # If a user is authenticated and has a valid subscription for the associated product, allow access
        if request.user and instance.is_accessible(user):
            return data
        else:
            # Nakasub dapat user para maaccess
            data['message'] = "You must be subscribed to access this video." 
            return data   


class DeleteVideoSerializer(serializers.Serializer):
    video_id = serializers.IntegerField()


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    video = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_details = UserSerializer(source='user', read_only=True)  # Add this field to get the user's details


    class Meta:
        model = Question
        fields = '_all_'



class StatisticsQuestionSerializer(serializers.ModelSerializer):
    video = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_details = UserSerializer(source='user', read_only=True)  # Add this field to get the user's details
    video_title = serializers.CharField(source='video.title', read_only=True)
    product_name = serializers.CharField(source='video.product.name', read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(source='video.product._id', read_only=True)  # Add product_id field


    class Meta:
        model = Question
        fields = ['id', 'video', 'user', 'user_details', 'video_title', 'product_name', 'product_id', 'question', 'reply', 'createdAt']

class QuestionSerializer(serializers.ModelSerializer):
    video = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    user_details = UserSerializer(source='user', read_only=True)  # Add this field to get the user's details


    class Meta:
        model = Question
        fields = '__all__'