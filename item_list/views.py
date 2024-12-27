from django.shortcuts import render

def index(request):
    # Pass optional context variables if needed
    page = request.GET.get('page', 1)  # Default to page 1
    rows_per_page = request.GET.get('rows', 10)  # Default to 10 rows per page
    context = {
        'page': page,
        'rows_per_page': rows_per_page,
    }
    return render(request, 'item_list/index.html', context)
