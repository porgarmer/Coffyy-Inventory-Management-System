from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'first_name', 'last_name', 'username', 'email_address', 'role')
    list_filter = ('role',)
    search_fields = ('first_name', 'last_name', 'username', 'email_address')
    ordering = ('id',)
