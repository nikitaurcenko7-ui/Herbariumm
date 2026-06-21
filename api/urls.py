from django.urls import path

from . import views

urlpatterns = [
    path('products/', views.products),
    path('orders/', views.orders),
    path('track-order/', views.track_order),
    path('supply-requests/', views.supply_requests),
    path('session/', views.session),
    path('login/', views.login_view),
    path('register/', views.register_view),
    path('logout/', views.logout_view),
    path('admin/summary/', views.admin_summary),
    path('admin/products/', views.admin_products),
    path('admin/products/<int:product_id>/', views.admin_product_detail),
    path('admin/users/', views.admin_users),
]
