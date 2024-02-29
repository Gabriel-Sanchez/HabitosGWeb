from django.shortcuts import render
from .models import Habito, Historial_habitos
from datetime import date, timedelta, datetime
from django.core.serializers import serialize
from django.http import JsonResponse
from django.utils import timezone

# Create your views here.

def listar_habitos():
    # fecha_actual = date.today()
    fecha_actual = timezone.now()
    habitosenelhistorial_no_hoy = Habito.objects.exclude(historial_habitos__fecha_inicio__date=fecha_actual)
    habitosenelhistorial_hoy = Habito.objects.filter(historial_habitos__fecha_inicio__date=fecha_actual)
 
    habitos_No_hechos_hoy = list(habitosenelhistorial_no_hoy.values('id', 'type__numero', 'nombre', 'work_time', 'short_break', 'count', 'orden_n', 'color', 'objetivo', 'progresion'))
    habitos_hechos_hoy = list(habitosenelhistorial_hoy.values('id', 'type__numero', 'nombre', 'work_time', 'short_break', 'count', 'orden_n', 'color', 'objetivo', 'progresion'))
    context = {
        
        'Habitos_por_hacer': habitos_No_hechos_hoy,
        'Habitos_hechos': habitos_hechos_hoy,
    }
    return context
    

def obtener_habitos_restantes_hoy(request):
    context = listar_habitos()
    return JsonResponse(context, safe=False)


def home_habitos(request):
    context = listar_habitos()
    return render(request, 'habitos_app/habitos_home.html', context)


def check_habito(request, habito):
    
    objeto_habito = Habito.objects.get(id = habito)
    # fecha_actual = datetime.now()
    fecha_actual = timezone.now()
    
    duracion_campo = timedelta(hours=0, minutes=objeto_habito.work_time, seconds=0)
    descanso_campo = timedelta(hours=0, minutes=0, seconds=0)
    
    # fecha_hora_fin = timezone.make_aware(datetime.strptime(f'{csv_fecha} {csv_end_timer}', '%Y-%m-%d %H:%M:%S'))
    
    Historial_habitos.objects.create(    
                                     fk_habito = objeto_habito,
                                        fecha_inicio = fecha_actual,
                                        fecha_fin = fecha_actual,
                                        duracion = duracion_campo,
                                        duracion_descanso = descanso_campo
    )
    
    print(habito)
    context = {
        'mensaje': 'bien'
    }
    return JsonResponse(context, safe=False)


def getHabitosOnly(request):
    
    objtosHabitos = Habito.objects.all()
    
    listaHabitos = list(objtosHabitos.values())
    
    context = {
        'listaHabitos': listaHabitos
    }
    
    
    return JsonResponse(context, safe=False)