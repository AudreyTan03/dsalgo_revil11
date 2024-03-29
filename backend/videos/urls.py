from django.urls import path
from . import views
from django.conf.urls.static import static

urlpatterns = [
    path('videos/upload/', views.uploadProductVideo, name='upload-video'),
    path('videos/delete/', views.deleteVideo, name='delete-video'),
    path('products/<int:product_id>/videos/', views.listProductVideos, name='list_product_videos'),
    path('products/<int:product_id>/videos/<int:video_id>/', views.getProductVideo, name='get_product_video'),
    path('products/<int:product_id>/subscribe/', views.subscribe_to_course, name='subscribe-to-course'),

]