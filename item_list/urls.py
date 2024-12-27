from django.urls import path
from . import views

app_name = 'item_list'  # Namespace for the app

urlpatterns = [
    path('', views.index, name='item_list_index'),  # URL pattern for item_list_index
]