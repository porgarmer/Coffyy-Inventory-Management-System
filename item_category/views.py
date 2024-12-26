from django.shortcuts import render

def index(request):
    return render(request, 'item_category/index.html')
