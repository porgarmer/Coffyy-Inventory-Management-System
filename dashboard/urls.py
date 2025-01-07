from django.urls import path
from . import views

app_name = "dashboard"  # Use `app_name` instead of `appname`
urlpatterns = [
    path("", views.index, name="index")
]
