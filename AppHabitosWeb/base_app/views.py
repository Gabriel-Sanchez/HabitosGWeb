from django.shortcuts import render
from habitos_app.models import  Habito, Historial_habitos
from datetime import date
from django.core.serializers import serialize
from django.http import JsonResponse

# Create your views here.

def home(request):
  
    return render(request, 'base_app/prueba2.html')
