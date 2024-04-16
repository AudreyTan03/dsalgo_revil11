import random
import os
from django.db import models
from base.models import Order, Product, User

import os
import random

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext

def upload_video_path(instance, filename):
    new_filename = random.randint(1, 3910209312)
    name, ext = get_filename_ext(filename)
    final_filename = f"{new_filename}{ext}"
    return f"product_subscribed/{final_filename}"

class Video(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=200)
    video_file = models.FileField(upload_to=upload_video_path)
    description = models.TextField(null=True, blank=True)
    uploadedAt = models.DateTimeField(auto_now_add=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='videos')

    def __str__(self):
        return self.title

    def is_accessible(self, user):
        if self.product and self.product.isPaid:
            return True  # Accessible if the produ

        # Check if the user is subscribed to the associated product
        return Subscription.objects.filter(user=user, product=self.product).exists() or self.product.isPaid
    
class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')  # Ensure uniqueness of subscription per user and product

    def __str__(self):
        return f"{self.user.name} subscribed to {self.product.name} at {self.subscribed_at}"  # Once lang pwede magsub user sa isang course

class OrderVideo(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='ordered_videos')
    video = models.ForeignKey(Video, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.order} - {self.video}"
    

class Question(models.Model):
    id = models.AutoField(primary_key=True)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='questions')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    reply = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Question by {self.user.username} on {self.video.title}"