from django.urls import path
from . import views

urlpatterns = [
    path('', views.suppliers, name='suppliers'),
    path('add', views.add_supplier, name='add-supplier'),
    path('delete_supplier', views.delete_supplier, name='delete-supplier'),
    path('edit/<int:supp_id>', views.edit_supplier, name='edit-supplier'),
    path('api/zip-codes', views.zip_codes, name="zip_codes"),
    path('check-supplier/<str:supp_name>', views.check_supplier, name="check-supplier"),

]
