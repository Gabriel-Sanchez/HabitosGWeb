from django.shortcuts import render
from .models import Habito, Historial_habitos, TiposHabitos
from datetime import date, timedelta, datetime
from django.core.serializers import serialize
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Max
import json

# Create your views here.

def listar_habitos():
    # fecha_actual = date.today()
    fecha_actual = timezone.now()
    habitosenelhistorial_no_hoy = Habito.objects.exclude(listHabitoHistorial__fecha_inicio__date=fecha_actual)
    habitosenelhistorial_hoy = Habito.objects.filter(listHabitoHistorial__fecha_inicio__date=fecha_actual)
 
    habitos_No_hechos_hoy = [habito.obtener_valores() for habito in habitosenelhistorial_no_hoy]
    habitos_hechos_hoy = [habito.obtener_valores() for habito in habitosenelhistorial_hoy]
    context = {
        
        'Habitos_por_hacer': habitos_No_hechos_hoy,
        'Habitos_hechos': habitos_hechos_hoy,
    }
    return context
    

def obtener_habitos_restantes_hoy(request):
    context = listar_habitos()
    # print(context)
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
    
    # print(habito)
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

def getHistorialHabito(request, id_habito):
    objetoHistorialHabito = Historial_habitos.objects.filter(fk_habito=id_habito)
    lista_HistorialHabito = [historial.obtenerHistorialFormateado() for historial in objetoHistorialHabito ]
    lista_HistorialFechaDuracion = [historial.obtenerHistorialFechaDuracion() for historial in objetoHistorialHabito ]
    # print(lista_HistorialHabito)
    varTotalTimpoHabito = objetoHistorialHabito.first().fk_habito.totalMinutosHabitos()
    
    context = {
        'lista_HistorialHabito': lista_HistorialHabito,
        'data_historial': lista_HistorialFechaDuracion,
        'TotalTiempo': varTotalTimpoHabito
    }
    return JsonResponse(context, safe=False )


def getHistorialHabitosBar(request, id_habito):
    objetoHistorialHabito = Historial_habitos.objects.filter(fk_habito=id_habito)
    lista_HistorialHabito = [historial.obtenerHistorialFormateado() for historial in objetoHistorialHabito ]
    lista_HistorialFechaDuracion = [historial.obtenerHistorialFechaDuracion() for historial in objetoHistorialHabito ]
    print('busca bar')
    context = {
        'lista_HistorialHabito': lista_HistorialHabito,
        'data_historial': lista_HistorialFechaDuracion
    }
    return JsonResponse(context, safe=False )


def guardar_formulario_Habito(request, id_habito):
    
    if request.method == 'POST':
        
        objetoHabito = Habito.objects.get(id=id_habito)
        datos = json.loads(request.body)
       
        numero_campo = datos['id']
        nombre = str(datos['nombre']) 
        work_time = datos['work_time']
        short_break = datos['short_break']
        count = datos['count']
        campo_type =  TiposHabitos.objects.get(numero=datos['type']) 
        #orden_n = datos['orden_n']
        color = datos['color']
        objetivo = datos['objetivo']

        objetoHabito.numero=numero_campo
        objetoHabito.nombre=nombre
        objetoHabito.work_time=work_time
        objetoHabito.short_break=short_break
        objetoHabito.count=count
        objetoHabito.type=campo_type
        #objetoHabito.orden_n=orden_n
        objetoHabito.color=color
        objetoHabito.objetivo=objetivo
        
        objetoHabito.save()

        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    
    
def set_NewHabitoformHabito(request):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
       
        numero_campo = datos['id']
        nombre = str(datos['nombre']) 
        work_time = datos['work_time']
        short_break = datos['short_break']
        count = datos['count']
        campo_type =  TiposHabitos.objects.get(numero=datos['type']) 
        color = datos['color']
        objetivo = datos['objetivo']
        
        ultimo_valor_mas_alto = Habito.objects.aggregate(max_valor_mas_alto=Max('orden_n'))['max_valor_mas_alto']
        if ultimo_valor_mas_alto is None:
            nuevo_valor = 1
        else:
            nuevo_valor = ultimo_valor_mas_alto + 1

        habito = Habito.objects.create(
            numero=numero_campo,
            nombre=nombre,
            work_time=work_time,
            short_break=short_break,
            count=count,
            type=campo_type,
            orden_n=nuevo_valor,
            color=color,
            objetivo=objetivo
        )

        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    
    

def archivarHabito(request, id_habito):
    if request.method == 'POST':
        datos = json.loads(request.body)
        print(id_habito)
        print(datos)
       
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})