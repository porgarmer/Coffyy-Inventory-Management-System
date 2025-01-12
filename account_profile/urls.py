from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from login import views as login_views



app_name = 'account_profile'  # Namespace for the app

urlpatterns = [
    path('login/', login_views.index, name='login_index'),  # Login redirection
    path('', views.view_account, name='view_account'),  # Load page and display data
    path('edit-page/', views.view_account, name='edit_account_page'),  # Load edit page
    path('edit/', views.edit_account, name='edit_account'),  # URL for editing account
    path('update-password/', views.update_password, name='update_password'),  # New URL for password update
]