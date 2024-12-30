from django.shortcuts import render

# Create your views here.
def login(request):
    return render(request, "login/login.html")

def register(request):
    return render(request, "login/register.html")

def forgot_pass(request):

def forgot_pass_email(request):
    return render(request, "login/forgot_pass_email.html")