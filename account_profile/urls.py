from django.urls import path
from django.contrib.auth import views as auth_views
from . import views
from login.views import index

app_name = 'account_profile'  # Namespace for the app

urlpatterns = [
    path('login/', index, name='login_index'),  # Correctly call login_index
    path('', views.edit_account, name='edit_account'),  # URL for editing account
    path('update-profile/', views.update_profile, name='update_profile'),  # URL for updating profile
    path('update-password/', views.update_password, name='update_password'),  # URL for updating password
    path('delete-account/', views.delete_account, name='delete_account'),  # URL for deleting account
]
