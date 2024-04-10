from django.db.models.signals import post_save
from django.dispatch import receiver
from django.apps import apps

@receiver(post_save, sender='orders.Order')
def update_subscription(sender, instance, created, **kwargs):
    """
    Update or create subscription when an order is marked as paid.
    """
    if instance.isPaid and not instance.isDelivered:
        Product = apps.get_model('base', 'Product')
        Subscription = apps.get_model('videos', 'Subscription')
        
        product = instance.order_items.first().product  # Assuming one product per order item
        user = instance.user
        # Check if the user is already subscribed to the product
        subscription_exists = Subscription.objects.filter(user=user, product=product).exists()
        if not subscription_exists:
            # If subscription does not exist, create a new one
            subscription = Subscription.objects.create(user=user, product=product)
            print(f"Subscription created for {user.name} to {product.name}")
        else:
            # If subscription already exists, update it
            subscription = Subscription.objects.get(user=user, product=product)
            print(f"Subscription already exists for {user.name} to {product.name}. Updating...")
            # Add logic here to update subscription if needed
    else:
        # If order is not paid or already delivered, no action is needed
        print("Order not paid or already delivered. Subscription not updated.")
