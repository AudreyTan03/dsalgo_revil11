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
from .serializers import ProductSerializer
from datetime import datetime


class ProductPatchView(generics.UpdateAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
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
    permission_classes = [IsAdminUser]

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


class PostProduct(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        product_serializer = ProductSerializer(data=request.data)
        if product_serializer.is_valid():
            product_serializer.save()
            return Response(product_serializer.data, status=status.HTTP_201_CREATED)
        else:
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
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except ValueError:
        return Response({'detail': 'Invalid product ID'}, status=status.HTTP_400_BAD_REQUEST)


def saveShippingAddress(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data['user']
        address = data['address']
        city = data['city']
        postalCode = data['postalCode']
        country = data['country']

        user = User.objects.get(id=user_id)

        shipping_address, created = ShippingAddress.objects.update_or_create(
            user=user,
            defaults={
                'address': address,
                'city': city,
                'postalCode': postalCode,
                'country': country,
            },
        )

        return JsonResponse({'status': 'Address saved successfully'})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)
    

@api_view(['POST'])
def addOrderItems(request):
    user = request.user
    data = request.data
    orderItems = data.get('orderItems', [])

    if not orderItems:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod'),
            taxPrice=data.get('taxPrice', 0),
            shippingPrice=data.get('shippingPrice', 0),
            totalPrice=data.get('totalPrice', 0)
        )
        for item in orderItems:
            try:
                product = Product.objects.get(_id=item['product'])  # Use _id here
                order_item = order.order_items.create(  # Corrected usage of related name
                    product=product,
                    name=product.name,
                    qty=item['qty'],
                    price=item['price'],
                    image=product.image.url
                )
                product.countInStock -= order_item.qty
                product.save()
            except Product.DoesNotExist:
                return Response({'detail': f'Product with id {item["product"]} does not exist'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer

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
    order = Order.objects.get(_id=pk)
    order.isPaid = True
    order.paidAt = datetime.now()
    order.save()

    return Response({'detail': 'Order was paid'})

    





