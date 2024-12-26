from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='item_categories_index'),
]
