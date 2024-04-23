import json
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Product, ShippingAddress
from .serializers import ProductSerializer
from  rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated
from .models import Product
from .serializers import ProductSerializer, UploadProductSerializer
from datetime import datetime
from django.db.models import Count, Sum
from videos.serializers import UploadVideoSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer
from videos.models import OrderVideo, Subscription, Video

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Review
from .serializers import ReviewSerializer
from user.models import Profile


@api_view(['DELETE'])
def delete_review(request, pk):
    try:
        review = Review.objects.get(pk=pk)
    except Review.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    review.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getReview(request, pk):
    try:
        review = Review.objects.get(pk=pk)
        serializer = ReviewSerializer(review)
        return Response(serializer.data)
    except Review.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'detail': 'Invalid product ID'}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def getReviews(request):
    review = Review.objects.all()
    serializers = ReviewSerializer(review, many=True)
    return Response(serializers.data)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Review
from .serializers import ReviewSerializer

@api_view(['POST'])
def create_review(request):
    serializer = ReviewSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductPatchView(generics.UpdateAPIView):
    serializer_class = EditProductSerializer

    def get_object(self):
        product_id = self.kwargs.get('pk')  # Get the product ID from URL parameters
        return Product.objects.get(pk=product_id)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()  # This gets the product instance based on the ID in the URL
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class ProductDeleteView(generics.DestroyAPIView):
    queryset = Product.objects.all()
    lookup_field = 'pk'

    def delete(self, request, *args, **kwargs):
        try:
            product = self.get_object()
            product.delete()
            return Response({"message": "Product deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except Product.DoesNotExist:
            return Response({"message": "Product does not exist"}, status=status.HTTP_404_NOT_FOUND)



class ProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        category_id = request.query_params.get('category')
        if category_id:
            products = Product.objects.filter(category_id=category_id)
        else:
            products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

class CategoryList(APIView):

    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CategoryDetail(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        return get_object_or_404(Category, pk=pk)

    def get(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category)
        return Response(serializer.data)

    def put(self, request, pk):
        category = self.get_object(pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        category = self.get_object(pk)
        category.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


from django.http import JsonResponse
import logging

logger = logging.getLogger(__name__)


class PostProduct(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        product_serializer = UploadProductSerializer(data=request.data, context={'request': request})
        if product_serializer.is_valid():
            product_instance = product_serializer.save(user=request.user)  # user nagrequest ng post masasave as user foreignkey
            logger.info("Product instance created: %s", product_instance)

            # Video shit
            videos_data = request.FILES.getlist('videos')
            for video_data in videos_data:
                video_serializer = UploadVideoSerializer(data={'title': video_data.name, 'video_file': video_data, 'product': product_instance._id}, context={'request': request})
                if video_serializer.is_valid():
                    video_serializer.save()
                else:
                    
                    product_instance.delete()
                    return Response(video_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            return Response(product_serializer.data, status=status.HTTP_201_CREATED)
        else:
            logger.error("Product creation failed. Errors: %s", product_serializer.errors)
            return Response(product_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/products/',
        '/api/products/create/',
        '/api/products/upload/',
        '/api/products/<id>/reviews/',
        '/api/products/top/',
        '/api/products/<id>/',
        '/api/products/delete/<id>/',
        '/api/products/<update>/<id>/',
    ]
    return Response(routes)


@api_view(['GET'])
def getProducts(request):
    product = Product.objects.all()
    serializers = ProductSerializer(product, many=True)
    return Response(serializers.data)


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        user = request.user

        # Check if the user is authenticated
        if user.is_authenticated:
            # Check if the user is subscribed to the product
            if Subscription.objects.filter(user=user, product=product).exists():
                # User is subscribed, set add_to_cart to False
                serializer = ProductSerializer(product)
                data = serializer.data
                data['add_to_cart'] = False
                return Response(data, status=status.HTTP_200_OK)
            else:
                # User is authenticated but not subscribed, include the "Add to Cart" button
                serializer = ProductSerializer(product)
                data = serializer.data
                data['add_to_cart'] = True
                return Response(data, status=status.HTTP_200_OK)
        else:
            # User is not authenticated, include the "Add to Cart" button
            serializer = ProductSerializer(product)
            data = serializer.data
            data['add_to_cart'] = True
            return Response(data, status=status.HTTP_200_OK)

    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'detail': 'Invalid product ID'}, status=status.HTTP_400_BAD_REQUEST)


# def saveShippingAddress(request):
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         user_id = data['user']
#         address = data['address']
#         city = data['city']
#         postalCode = data['postalCode']
#         country = data['country']

#         user = User.objects.get(id=user_id)

#         shipping_address, created = ShippingAddress.objects.update_or_create(
#             user=user,
#             defaults={
#                 'address': address,
#                 'city': city,
#                 'postalCode': postalCode,
#                 'country': country,
#             },
#         )

#         return JsonResponse({'status': 'Address saved successfully'})
#     else:
#         return JsonResponse({'error': 'Invalid request'}, status=400)


    

@api_view(['POST'])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems', [])

    print("Request received in addOrderItems:", request.data)  # Log the request data

    if not orderItems:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        with transaction.atomic():
            order = Order.objects.create(
                user=user,
                paymentMethod=data.get('paymentMethod'),
                totalPrice=data.get('totalPrice', 0)
            )
            for item in orderItems:
                try:
                    product = Product.objects.get(_id=item['product'])
                    merchant_profile = Profile.objects.get(user=product.user)
                    order_item = order.order_items.create(
                        product=product,
                        merchant_id=merchant_profile.merchant_id,
                        name=product.name,
                        user=product.user,
                        qty=item['qty'],
                        price=item['price'],
                        image=product.image.url
                    )
                    Sale.objects.create(user=product.user, order_item=order_item)
                    print("Found product:", product)  # Log the found product
                except Product.DoesNotExist:
                    print("Product not found")  # Log if product is not found
                    return Response({'detail': f'Product with id {item["product"]} does not exist'}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = OrderSerializer(order)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        print("Error occurred in addOrderItems:", e)  # Log the error
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def access_videos(request, product_id):
    user = request.user
    product = get_object_or_404(Product, pk=product_id)

    # Check if the user has purchased the product
    has_purchased = Order.objects.filter(user=user, product=product, isPaid=True).exists()

    if has_purchased:
        # User has purchased the product, provide access to the videos
        videos = product.get_videos()
        video_urls = [video.video_file.url for video in videos]
        return Response({'videos': video_urls})
    else:
        # User has not purchased the product, allow them to purchase it
        return Response({'detail': 'You need to purchase the product to access the videos'}, status=status.HTTP_403_FORBIDDEN)
        
    
class OrderItemView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order_items = OrderItem.objects.filter(order=pk)
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data)
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):  # Changed 'pk' to 'id'
    user = request.user
    try:
        order = Order.objects.get(_id=pk)  # Updated '_id=pk' to 'id=id'
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Unauthorized access'}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    try:
        with transaction.atomic():
            order = Order.objects.select_for_update().get(_id=pk)
            if not order.isPaid:
                order.isPaid = True
                order.paidAt = datetime.now()
                order.save()

                # Perform additional actions only if the order was successfully marked as paid
                for order_item in order.order_items.all():
                    product = order_item.product

                    # Create sale instance per product
                    Sale.objects.create(user=product.user, order_item=order_item)

                    product.countInStock -= order_item.qty
                    product.save()

                # Kada product sa oerder item massusb
                for order_item in order.order_items.all():
                    product = order_item.product
                    Subscription.objects.create(user=order.user, product=product)

                return Response({'detail': 'Order was paid'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Order is already paid'}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_sales_statistics(request):
    user = request.user
    # Fetch total sales and revenue for the user
    sales_data = Sale.objects.filter(user=user).aggregate(total_sales=Count('id'), total_revenue=Sum('order_item__price'))
    
    # Fetch all sales made by the user
    sales = Sale.objects.filter(user=user).select_related('order_item__order', 'order_item__product')
    
    # Prepare data for response
    users_data = []
    for sale in sales:
        order_item = sale.order_item
        if order_item and order_item.order and order_item.product:
            user_data = {
                'id': order_item.order.user.id,
                'name': order_item.order.user.name,
                'orders': [{
                    'id': order_item.order._id,
                    'product': {
                        'name': order_item.product.name,
                        'description': order_item.product.description,
                        'price': order_item.price
                    }
                }]
            }
            users_data.append(user_data)

    return Response({
        'total_sales': sales_data['total_sales'],
        'total_revenue': sales_data['total_revenue'] if sales_data['total_revenue'] else 0,
        'users': users_data
    })




@api_view(['GET'])
def get_user_products(request):
    user_id = request.query_params.get('user')
    if not user_id:
        return Response({'error': 'User ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        products = Product.objects.filter(user_id=user_id)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


@api_view(['GET'])
def search(request):
    query = request.query_params.get('query', '')

    # Search for products by name or description
    product_results = Product.objects.filter(Q(name__icontains=query) | Q(description__icontains=query))
    product_serializer = ProductSerializer(product_results, many=True)

    # Search for users by name
    user_results = User.objects.filter(name__icontains=query)
    user_serializer = UserSerializer(user_results, many=True)

    response_data = {
        'products': product_serializer.data,
        'users': user_serializer.data
    }

    return Response(response_data)
    

# class RatingCreateAPIView(APIView):
#     permission_classes = [IsAuthenticated]  # Add permission_classes here
    
#     def post(self, request, *args, **kwargs):
#         serializer = RatingSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save(user=request.user)  # Assuming the user is authenticated
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class RatingUpdateAPIView(APIView):
#     permission_classes = [IsAuthenticated]  # Add permission_classes here
    
#     def put(self, request, pk, *args, **kwargs):
#         rating = Rating.objects.get(pk=pk)
#         serializer = RatingSerializer(rating, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class RatingListAPIView(APIView):
#     permission_classes = [IsAuthenticated]  # Add permission_classes here
    
#     def get(self, request, *args, **kwargs):
#         ratings = Rating.objects.all()
#         serializer = RatingSerializer(ratings, many=True)
#         return Response(serializer.data)