from django.urls import path
from . import views

urlpatterns = [
    path('', views.suppliers, name='suppliers'),
    path('add', views.add_supplier, name='add-supplier'),
    path('delete_supplier', views.delete_supplier, name='delete-supplier'),
    path('edit', views.delete_supplier, name='edit-supplier'),
    path('api/zip-codes', views.zip_codes, name="zip_codes")
]
