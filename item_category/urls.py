from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='item_categories_index'),
    path('add/', views.add_category, name='add_category'),  # URL for the Add Category page
]
