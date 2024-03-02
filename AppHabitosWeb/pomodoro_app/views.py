from django.shortcuts import render
from habitos_app.models import Habito, Historial_habitos
from django.http import JsonResponse
import json
from django.utils import timezone
from datetime import timedelta, datetime

# Create your views here.


def ventana_pomodoro(request, id_habito):
    
    filtroObjetotHabito = Habito.objects.get(id = id_habito)
    objetoHabito = filtroObjetotHabito.obtener_valores()
    context = {
        'objHabito': objetoHabito
    }
    return render(request, 'pomodoro_app/pomodoro.html', context)

def set_Inicio_Habito(request):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
        id_habito = int(datos['id_habito']) 
        
        fecha_actual = timezone.now()

        objetoHistoralHabito = Historial_habitos.objects.filter(fecha_inicio__date=fecha_actual, fk_habito__id=id_habito)

        if not objetoHistoralHabito.exists():
            
            obj_id_habito = Habito.objects.get(id = id_habito)
            fecha_hora_inicio = fecha_actual
            fecha_hora_fin = fecha_actual
            duracion_campo = timedelta(hours=0, minutes=0, seconds=0)
            d_descanso = timedelta(hours=0, minutes=0, seconds=0)
            
            nuevo_historial = Historial_habitos.objects.create(
                    fk_habito=obj_id_habito, 
                    fecha_inicio=fecha_hora_inicio, 
                    fecha_fin=fecha_hora_fin, 
                    duracion=duracion_campo, 
                    duracion_descanso=d_descanso, 
                    )
            nuevo_historial.save()
            nuevo_historial = nuevo_historial.obtenerHistorialFormateado()
            return JsonResponse({'mensaje': 'Datos recibidos correctamente', 'nuevo_historial': nuevo_historial})

        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    
    
def set_tiempo_Habito(request):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
        print('Datos recibidos:', datos)
        id_habito = int(datos['id_habito']) 
        
        fecha_actual = timezone.now()
        # fecha_actual = datetime.now()
        print(id_habito)
        
        objetoHistoralHabito = Historial_habitos.objects.filter(fecha_inicio__date=fecha_actual, fk_habito__id=id_habito)

        if objetoHistoralHabito.exists():
            
            objetoHistoralHabito = objetoHistoralHabito.first()
 
            fecha_hora_fin = fecha_actual
            old_duracion_campo = objetoHistoralHabito.duracion
            new_duracion_campo= timedelta(hours=0, minutes=0, seconds=int(datos['tiempo_habito']) )
            duracion_campo = old_duracion_campo + new_duracion_campo
            
            objetoHistoralHabito.fecha_fin=fecha_hora_fin
            objetoHistoralHabito.duracion=duracion_campo 
                    
            objetoHistoralHabito.save()
            objetoHistoralHabito = objetoHistoralHabito.obtenerHistorialFormateado()
            return JsonResponse({'mensaje': 'Datos recibidos correctamente', 'nuevo_historial': objetoHistoralHabito})
        print('Datos recibidos:', datos)
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    
def set_descanso_Habito(request):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
        print('Datos recibidos:', datos)
        id_habito = int(datos['id_habito']) 
        
        fecha_actual = timezone.now()
        # fecha_actual = datetime.now()
        print(id_habito)
        
        objetoHistoralHabito = Historial_habitos.objects.filter(fecha_inicio__date=fecha_actual, fk_habito__id=id_habito)

        if objetoHistoralHabito.exists():
            
            objetoHistoralHabito = objetoHistoralHabito.first()
            
            fecha_hora_fin = fecha_actual
            old_d_descanso = objetoHistoralHabito.duracion_descanso 
            new_d_descanso = timedelta(hours=0, minutes=0, seconds=int(datos['tiempo_descanso']) )
            d_descanso = old_d_descanso + new_d_descanso
            
            objetoHistoralHabito.fecha_fin=fecha_hora_fin
            objetoHistoralHabito.duracion_descanso=d_descanso 
                    
            objetoHistoralHabito.save()
            objetoHistoralHabito = objetoHistoralHabito.obtenerHistorialFormateado()
            
            return JsonResponse({'mensaje': 'Datos recibidos correctamente', 'nuevo_historial': objetoHistoralHabito})
        print('Datos recibidos:', datos)
       
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    
def set_fin_Habito(request):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
        print('Datos recibidos:', datos)
        id_habito = int(datos['id_habito']) 
        
        fecha_actual = timezone.now()
        print(id_habito)
        
        objetoHistoralHabito = Historial_habitos.objects.filter(fecha_inicio__date=fecha_actual, fk_habito__id=id_habito)

        if objetoHistoralHabito.exists():
            
            objetoHistoralHabito = objetoHistoralHabito.first()
            
            fecha_hora_fin = fecha_actual
         
            objetoHistoralHabito.fecha_fin=fecha_hora_fin 
            objetoHistoralHabito.save()
            objetoHistoralHabito = objetoHistoralHabito.obtenerHistorialFormateado()
            
            return JsonResponse({'mensaje': 'Datos recibidos correctamente', 'nuevo_historial': objetoHistoralHabito})
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    