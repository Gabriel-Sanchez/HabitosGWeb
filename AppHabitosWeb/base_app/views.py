from django.shortcuts import render
from habitos_app.models import  Habito, Historial_habitos
from datetime import date
from django.core.serializers import serialize
from django.http import JsonResponse

# Create your views here.

def home(request):
    fecha_actual = date.today()
    habitosenelhistorial_no_hoy = Habito.objects.exclude(historial_habitos__fecha_inicio__date=fecha_actual)
    
    context = {
        'habitos_hoy': habitosenelhistorial_no_hoy
    }
    

    return render(request, 'base_app/base_app.html', context)
