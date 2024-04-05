from django.conf import settings
from django.shortcuts import get_object_or_404
import pyotp
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
# from backend.user.models import User
from user.serializers import SendPasswordResetEmailSerializer, UserChangePasswordSerializer, UserPasswordResetSerializer, UserRegistrationSerializers, UserLoginSerializer, UserProfileSerializer
from django.contrib.auth import authenticate
from rest_framework.exceptions import ValidationError
from user.serializers import *
from user.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import permissions, status
import pyotp
from user.models import OTP
from django.core.mail import send_mail
# from .serializers import  UserSerializerWithToken

#Generate token Manually
# from rest_framework_simplejwt.tokens import RefreshToken
def get_tokens_for_user(user):
    # Generate refresh token
    refresh = RefreshToken.for_user(user)

    # Include user's name and email in the token payload
    access_token_payload = {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
        'name': user.name,  # Assuming 'name' is a field in your user model
        'email': user.email,  # Assuming 'email' is a field in your user model
        'id' : user.id
    }

    return access_token_payload


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        serializer = UserRegistrationSerializers(data=data, context={'request': request})
        if serializer.is_valid(raise_exception=True):
            user_type = serializer.validated_data.get('user_type', 'student')
            is_instructor = user_type == 'instructor'

            # Generate OTP, create user, and save OTP secret key
            otp_key = pyotp.random_base32()
            otp_instance = pyotp.TOTP(otp_key, digits=6)
            otp_code = otp_instance.now()

            user = serializer.save(user_type=user_type, is_instructor=is_instructor)
            otp = OTP.objects.create(
                user=user,
                otp_secret=otp_key,
            )

            # Create a profile for the registered user
            # Profile.objects.create(user=user, name=data.get('name', ''), image=data.get('image'), bio=data.get('bio'))

            # Send OTP via email
            send_otp_email(data["email"], otp_code)

            token = get_tokens_for_user(user)
            response_data = {
                "user_id": user.id,
                "otp_id": otp.id,
                "token": token,
                "detail": "User successfully registered. Please check your email for the OTP code.",
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
    except Exception as e:
        message = {'detail': str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def verify_otp(request):
    data = request.data
    try:
        user_id = data["user_id"]
        otp_id = data["otp_id"]
        otp_code = data["otp_code"]

        user = User.objects.get(id=user_id)
        otp = OTP.objects.get(id=otp_id, user=user)

        print(otp_code)
        print(otp.otp_secret)
        totp = pyotp.TOTP(otp.otp_secret)
        if totp.verify(otp_code, valid_window=7):
            user.is_active = True
            user.save()

            otp.is_verified = True
            otp.save()
            
            return Response({"detail": "OTP verified successfully"}, status=status.HTTP_200_OK)
        
        else:
            raise Exception("Invalid OTP code")
    except Exception as e:
        message = {"detail": str(e)}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

def send_otp_email(email, otp_code):
    subject = "OTP Verification"
    message = f"Your OTP code is: {otp_code}"
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [email]
    send_mail(subject, message, email_from, recipient_list)

@api_view(['POST'])
def resend_otp(request):
    data = request.data
    user_id = data['user_id']
    otp_id = data['otp_id']

    user = User.objects.get(id=user_id)
    otp = OTP.objects.get(id=otp_id, user=user)
    print(otp.otp_secret)
    # print(otp_code)

    otp_key = pyotp.random_base32()
    otp_instance = pyotp.TOTP(otp_key, digits=6)
    otp_code = otp_instance.now()

    otp.otp_secret = otp_key
    otp.is_verified = False
    otp.save()

    send_otp_email(user.email, otp_code)

    return Response({'message': 'OTP has been resent successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def loginUser(request, format=None):
    if request.method == 'POST':
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(email=email, password=password)
            
            if user is not None:
                token = get_tokens_for_user(user)
                user_type = 'instructor' if user.is_instructor else 'student'
                isAdmin = user.is_admin 

                response_data = {
                    'token': token,
                    'msg': 'Login Success',
                    'user_type': user_type,
                    'isAdmin': isAdmin,  
                }
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({'errors': {'non_field_errors': ['Email or Password is not valid']}}, status=status.HTTP_400_BAD_REQUEST)
        else:
            raise ValidationError(serializer.errors)





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def userProfile(request):
    user = request.user
    print(user)
    profile = get_object_or_404(Profile, user=user)
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    user = request.user
    profile = get_object_or_404(Profile, user=user)
    serializer = UserProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateTheme(request):
    user = request.user
    profile = Profile.objects.get(user=user)
    theme_preference = user.profile.theme_preference

    serializer = UserPreferenceSerializer(theme_preference, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserChangePasswordView(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (JWTAuthentication,)
    def post(self, request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data, context={'user': request.user})
        context = {'user': request.user}
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Change Password Succcessfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            return Response({'msg': 'Password Reset link send. Please check your Email'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self,request, uid, token , format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context = {'uid':uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':"Password Reset Succesfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


