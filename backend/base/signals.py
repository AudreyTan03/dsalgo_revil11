from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import OrderItem, Sale

@receiver(post_save, sender=OrderItem)
def create_sale_record(sender, instance, created, **kwargs):
    if created:
        Sale.objects.create(user=instance.product.user, order_item=instance)