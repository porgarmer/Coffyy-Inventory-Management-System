"""
URL configuration for Coffyy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('login.urls')),  # Include login URLs
    path('account-profile/', include('account_profile.urls')),  #purchase-order URLs
    path('dashboard/', include('dashboard.urls')), #ge test ra nakong sidebar ani abi. ilisi lang niya ni sa imoha
    path('item-list/', include('item_list.urls')),  # Include item_list URLs
    path('item-category/', include('item_category.urls')),  # Include the app's URLs
    path('purchase-order/', include('purchase_order.urls')),  #purchase-order URLs
    path('supplier/', include('supplier.urls'))
]
