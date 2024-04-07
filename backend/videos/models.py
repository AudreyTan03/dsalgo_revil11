import random
import os
from django.db import models
from base.models import Product, User

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext

def upload_video_path(instance, filename):
    new_filename = random.randint(1, 3910209312)
    name, ext = get_filename_ext(filename)
    final_filename = '{new_filename}{ext}'.format(new_filename=new_filename, ext=ext)
    return 'videos/{final_filename}'.format(new_filename=new_filename, final_filename=final_filename)

class Video(models.Model):
    title = models.CharField(max_length=200)
    video_file = models.FileField(upload_to="videos/")
    description = models.TextField(null=True, blank=True)
    uploadedAt = models.DateTimeField(auto_now_add=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_videos')

    def __str__(self):
        return self.title

    def is_accessible(self, user):
        if user and user.is_admin:
            return True
        
        if user and self.product.user == user:
            return True

        # Check if the user is subscribed to the associated product
        return Subscription.objects.filter(user=user, product=self.product).exists()
    
class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.name} - {self.product.name} Subscription"

    class Meta:
        unique_together = ('user', 'product')  # Once lang pwede magsub user sa isang course