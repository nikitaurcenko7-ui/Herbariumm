from django.contrib import admin

from .models import Order, Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "form", "price", "popular")
    list_filter = ("category", "form", "popular")
    search_fields = ("title", "description")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone", "city", "created_at")
    search_fields = ("name", "phone", "city")
    readonly_fields = ("created_at",)