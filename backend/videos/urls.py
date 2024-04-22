from django.urls import path
from . import views
from django.conf.urls.static import static

urlpatterns = [
    path('videos/upload/', views.uploadProductVideo, name='upload-video'),
    path('videos/delete/', views.deleteVideo, name='delete-video'),
    path('products/<int:product_id>/videos/', views.listProductVideos, name='list_product_videos'),
    path('videos/', views.get_all_videos, name='get_all_videos'), # admin
    path('get-video/<int:video_id>/', views.get_video, name='get_video'),
    path('products/<int:product_id>/videos/<int:video_id>/', views.get_product_video, name='get_product_video'),
    # path('subscribe/<int:product_id>/', views.subscribe_to_product, name='subscribe-product'),
    path('/order/<int:order_id>/videos/', views.orderVideos, name='order-videos'),
    path('check-subscription/<int:user_id>/<int:product_id>/', views.check_subscription, name='check_subscription'),
    path('products/<int:product_id>/videos/<int:video_id>/questions/', views.listQuestionForVid, name='list_questions_for_video'),
    path('products/<int:product_id>/videos/<int:video_id>/questions/post/', views.postQuestion, name='post_question'),
    path('products/<int:product_id>/videos/<int:video_id>/questions/<int:question_id>/reply/', views.postReply, name='post_reply'),
    path('user-product-questions/', views.userProductQuestions, name='user_product_questions'),
]