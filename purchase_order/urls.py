from django.urls import path
from . import views

urlpatterns = [
    path('', views.purchase_order, name='purchase-order'),
    path('create', views.create_purchase_order, name='create-purchase-order'),
    path('delete_purchase_order', views.delete_purchase_order, name='delete_purchase_order')
]
