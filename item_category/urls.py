from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='item_categories_index'),  # View for item categories index
    path('add/', views.add_category, name='add_category'),  # View for adding a category
    path('delete/', views.delete_categories, name='delete_categories'),  # View for deleting categories
    path('edit/<int:category_id>/', views.edit_category, name='edit_category'),  # Edit category page
    path('cancel-redirect/', views.cancel_redirect, name='cancel_redirect'),
]
