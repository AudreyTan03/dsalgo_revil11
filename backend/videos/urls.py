from django.urls import path
from . import views
from django.conf.urls.static import static

urlpatterns = [
    path('videos/upload/', views.uploadProductVideo, name='upload-video'),
    path('videos/delete/', views.deleteVideo, name='delete-video'),
    path('products/<int:product_id>/videos/', views.listProductVideos, name='list_product_videos'),
    path('videos/', views.get_all_videos, name='get_all_videos'),
    path('get-video/<int:video_id>/', views.get_video, name='get_video'),
    path('product/<int:product_id>/video/<int:video_id>/', views.get_product_video, name='product-video'),
    # path('subscribe/<int:product_id>/', views.subscribe_to_product, name='subscribe-product'),
    path('/order/<int:order_id>/videos/', views.orderVideos, name='order-videos'),
    path('check-subscription/<int:user_id>/<int:product_id>/', views.check_subscription, name='check_subscription'),
    

]