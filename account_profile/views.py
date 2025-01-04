from django.shortcuts import render

def edit_account(request):
    return render(request, 'account_profile/profile_admin.html')

