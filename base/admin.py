from django.contrib import admin
from .models import *
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# Register your models here.


# Define an admin class for the Category model
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)  # Display the 'name' field in the admin list view

# Register the models with the admin site
admin.site.register(Category, CategoryAdmin)
admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)

@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('user', 'order_item', 'created_at')
    list_filter = ('created_at', 'user')
    search_fields = ('user__name', 'order_item__name')


