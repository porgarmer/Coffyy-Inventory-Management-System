from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "login/login.html")

def register(request):
    return render(request, "login/register.html")

def forgot_pass(request):
    return render(request, "login/forgot_pass.html")

def forgot_pass_email(request):
    return render(request, "login/forgot_pass_email.html")