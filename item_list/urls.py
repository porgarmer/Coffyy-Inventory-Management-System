from django.urls import path
from . import views

app_name = 'item_list'  # Namespace for the app

urlpatterns = [
    path('', views.index, name='item_list_index'),  # URL pattern for item_list_index
    path('add/', views.add_item, name='add_item'),  # New URL pattern for add_item
    path('cancel_redirect/', views.cancel_redirect, name='cancel_redirect'),  # Add this line
    path('delete_items/', views.delete_items, name='delete_items'),
]
