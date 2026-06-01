from django.contrib import admin

from .models import Order, Product, SupplyRequest


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


@admin.register(SupplyRequest)
class SupplyRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "company", "phone", "contact", "volume", "created_at")
    search_fields = ("company", "phone", "contact", "comment")
    readonly_fields = ("user", "company", "phone", "contact", "volume", "comment", "payload", "created_at")

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
