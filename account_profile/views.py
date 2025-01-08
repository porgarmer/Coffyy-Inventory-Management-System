from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password
import json
from login.models import User

@csrf_exempt
def edit_account(request):
    user_id = request.session.get('user_id')
    if not user_id:
        messages.error(request, "You must be logged in to access this page.")
        return redirect('login:index')

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        messages.error(request, "User not found. Please log in again.")
        return redirect('login:index')

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            operation = data.get('operation')

            if operation == 'update_profile':
                user.contact_number = data.get('contact-number', user.contact_number)
                user.first_name = data.get('first-name', user.first_name)
                user.last_name = data.get('last-name', user.last_name)
                user.email = data.get('email', user.email)
                user.save()
                return JsonResponse({"success": True, "message": "Profile updated successfully!"})

            elif operation == 'update_password':
                new_password = data.get('password')
                if new_password:
                    user.password = make_password(new_password)
                    user.save()
                    return JsonResponse({"success": True, "message": "Password updated successfully!"})
                else:
                    return JsonResponse({"success": False, "error": "Password cannot be empty!"})

            elif operation == 'delete_account':
                user.delete()
                request.session.flush()
                return JsonResponse({"success": True, "message": "Account deleted successfully!"})

        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})

    return render(request, 'account_profile/profile_admin.html', {'user': user})
