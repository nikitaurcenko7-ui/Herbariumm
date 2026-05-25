from django.conf import settings
from django.db import models


class Product(models.Model):
    title = models.CharField(max_length=120)
    category = models.CharField(max_length=80)
    form = models.CharField(max_length=60)
    price = models.PositiveIntegerField()
    popular = models.BooleanField(default=False)
    tone = models.CharField(max_length=80, default='from-lime-200 to-emerald-500')
    image_url = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.title


class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    name = models.CharField(max_length=120)
    phone = models.CharField(max_length=40)
    city = models.CharField(max_length=120)
    address = models.CharField(max_length=255)
    comment = models.TextField(blank=True)
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'Order #{self.pk}'
