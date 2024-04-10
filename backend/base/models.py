from django.db import models
# from django.contrib.auth.models import User
import os
import random
from user.models import User
from django.conf import settings
# from django.db import models
# from django.contrib.auth.models import BaseUserManager,AbstractBaseUser
from django.db.models import Avg
# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to="static_cdn/images/")
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, default=0.00)
    numReviews = models.IntegerField(null=True, blank=True, default=0)  
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, default=0)
    preview_video = models.FileField(upload_to="static_cdn/videos/", null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True)
    editedAt = models.DateTimeField(auto_now=True)
    isPaid = models.BooleanField(default=False)

    def __str__(self):
        return self.name or 'Unnamed Product'


    def delete_files(self):
        # Delete the image file
        if self.image:
            storage, path = self.image.storage, self.image.path
            storage.delete(path)

        # Delete the video file
        if self.preview_video:
            storage, path = self.preview_video.storage, self.preview_video.path
            storage.delete(path)

    def delete(self, *args, **kwargs):
        # Delete associated files
        self.delete_files()

        # Call the parent class's delete method to delete the Product instance
        super(Product, self).delete(*args, **kwargs)

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null = True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null = True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.DecimalField(max_digits = 7, decimal_places = 2, null=True, blank=True)
    comment = models.TextField(null = True, blank = True)
    _id = models.AutoField(primary_key=True)

    def __str__(self):
        return str(self.rating)
    


class Order(models.Model):
    user = models.ForeignKey('user.User', on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)
    _id = models.AutoField(primary_key=True)

    @property
    def mean_rating(self):
        return self.rating.aggregate(Avg('rating'))['rating__avg']

    @mean_rating.setter
    def mean_rating(self, value):
        # This setter method is optional and depends on your requirements.
        # If you want to set the mean_rating explicitly, implement the setter accordingly.
        pass

    @property
    def num_reviews(self):
        return self.rating.count()

    def __str__(self):
        return f"Order {self._id} created at {self.createdAt}"
    


class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, default=0)
    price = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)
    order = models.ForeignKey(Order, related_name='order_items', on_delete=models.CASCADE)  
    _id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"OrderItem - {self.name}"
    


class Rating(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(choices=((1, '1 star'), (2, '2 star'), (3, '3 star'), (4, '4 star'), (5, '5 star')))
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating for Order {self.order_id}: {self.rating} stars by {self.user.name}"
    
class Sale(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sales')
    order_item = models.OneToOneField(OrderItem, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale #{self.pk} by {self.user.name}"
    

# @property
#     def mean_rating(self):
#         return self.rating.aggregate(Avg('rating'))['rating__avg']

#     @mean_rating.setter
#     def mean_rating(self, value):
#         # This setter method is optional and depends on your requirements.
#         # If you want to set the mean_rating explicitly, implement the setter accordingly.
#         pass

#     @property
#     def num_reviews(self):
#         return self.rating.count()
    
#     def __str__(self):
#         return self.title




class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank = True)
    address = models.CharField(max_length = 200, null=True, blank=True)
    city = models.CharField(max_length = 200, null=True, blank=True)
    postalCode = models.CharField(max_length = 200, null=True, blank=True)
    shippingPrice = models.CharField(max_length = 200, null=True, blank=True)
    shippingPrice = models.DecimalField(max_digits = 7, decimal_places = 2, null=True, blank = True)
    _id = models.AutoField(primary_key=True)

    def __str__(self):
        return str(self.address)
   

def get_filename_ext(filepath):
    base_name = os.path.basename(filepath)
    name, ext = os.path.splitext(base_name)
    return name, ext


def upload_image_path(instance, filename):
    new_filename =random.randint(1, 2541781232)
    name, ext =get_filename_ext(filename)
    final_filename= '{new_filename}{exit}'.format(new_filename=new_filename, ext=ext)
    return "img/{new_filename}/{final_filename}".format(new_filename=new_filename, final_filename=final_filename)

def upload_video_path(instance, filename):
    new_filename = random.randint(1, 3910209312)
    name, ext = get_filename_ext(filename)
    final_filename = '{new_filename}{ext}'.format(new_filename=new_filename, ext=ext)
    return 'videos/{final_filename}'.format(new_filename=new_filename, final_filename=final_filename)