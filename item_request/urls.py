from django.urls import path
from . import views

urlpatterns = [
    path('', views.item_request, name='item-request'),
    path('create', views.create_item_request, name='create-item-request'),
    path('details/<int:id>', views.request_details, name="request-details"),
    # path('receive/<int:po_id>', views.receive_items, name="receive-items"),
    path('edit/<int:id>', views.edit_item_request, name="edit-item-request"),
    path('delete_item_request', views.delete_item_request, name='delete-item-request'),
    path('approve_item_request/<int:id>', views.approve_item_request, name='approve-item-request'),
    path('deny_item_request/<int:id>', views.deny_item_request, name='deny-item-request'),

]
