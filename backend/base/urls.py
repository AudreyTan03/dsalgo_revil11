from django.urls import path

# from backend.api.serializers import SendPasswordResetEmailSerializer

from . import views
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from .views import ProductDeleteView
from base.views import addOrderItems 
from .views import getOrderById

urlpatterns = [
    path('', views.getRoutes, name="routes"),
    # path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('users/profile/', views.getUserProfile, name='users-profile'),
    # path('users/', views.getUserProfile, name='users-profiles'),
    # path('users/register/', views.registerUser, name='register'),
    path('products/', views.getProducts, name="products"),
    path('products/<str:pk>', views.getProduct, name="products"),
    path('post-product/', views.PostProduct.as_view(), name="post_product"),
    path('products/<int:pk>/delete/', ProductDeleteView.as_view(), name='product-delete'),
    path('categories/', CategoryList.as_view(), name='category-list'),
    path('products/<int:pk>/edit/', ProductPatchView.as_view(), name='product_edit'),
    path('add/', views.addOrderItems, name='orders-add'),
    path('order/<str:pk>/', views.getOrderById, name='get_order_by_id'),
    path('orders/<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('orders/myorders/', views.getMyOrders, name='myorders'),
    path('sales-statistics/', views.get_sales_statistics, name='sales-statistics'),
    path('order-items/<str:pk>/', views.OrderItemView.as_view(), name='order-items'),
    path('user-products/', views.get_user_products, name='user-products'),
    # path('ratings/create/', RatingCreateAPIView.as_view(), name='rating-create'),
    # path('ratings/<int:pk>/update/', RatingUpdateAPIView.as_view(), name='rating-update'),
    # path('ratings/', RatingListAPIView.as_view(), name='rating-list'),
    path('post-reviews/', create_review, name="review_product"),
    path('reviews/', views.getReviews, name="review_get"),
    path('reviews/<int:pk>/', views.getReview, name="review_get"),
    path('review/<int:pk>/delete/', delete_review, name='delete-review'),
    path('search/', views.search, name='search'),


]         