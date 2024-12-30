from django.urls import path
from . import views

urlpatterns = [
    path('', views.purchase_order, name='purchase-order'),
    path('create', views.create_purchase_order, name='create-purchase-order')
]
