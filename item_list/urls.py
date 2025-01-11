from django.urls import path
from . import views

app_name = 'item_list'  # Namespace for the app

urlpatterns = [
    path('', views.index, name='item_list_index'),  # URL pattern for item_list_index
    path('add/', views.add_item, name='add_item'),  # New URL pattern for add_item
    path('cancel_redirect/', views.cancel_redirect, name='cancel_redirect'),  # Add this line
    path('delete/', views.delete_items, name='delete_items'),
    path('search-items/', views.search_items, name='search_items'),
    path('search-items-edit/', views.search_items_edit, name='search_items_edit'),
    path('edit/<int:item_id>/', views.edit_item, name='edit_item'),
    path('check-item-name/', views.check_item_name, name='check_item_name'),
    path('check-item-name-edit/', views.check_item_name, name='check_item_name_edit'),
]
