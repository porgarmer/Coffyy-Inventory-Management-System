from django.urls import path
from . import views

appname = "dashboard"
urlpatterns = [
    path("", views.index, name="index")
]
