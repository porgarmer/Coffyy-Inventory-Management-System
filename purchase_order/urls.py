from django.urls import path
from . import views

urlpatterns = [
    path('', views.purchase_order, name='purchase-order'),
    path('create', views.create_purchase_order, name='create-purchase-order'),
    path('details/<int:po_id>', views.order_details, name="order-details"),
    path('receive/<int:po_id>', views.receive_items, name="receive-items"),
    path('edit/<int:po_id>', views.edit_purchase_order, name="edit-purchase-order"),
    path('delete_purchase_order', views.delete_purchase_order, name='delete_purchase_order'),
]
