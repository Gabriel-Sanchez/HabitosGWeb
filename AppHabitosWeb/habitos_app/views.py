from django.shortcuts import render
from .models import Habito, Historial_habitos, TiposHabitos, Tag, TagStats
from datetime import date, timedelta, datetime
from django.core.serializers import serialize
from django.http import JsonResponse
from django.utils import timezone
from django.db.models import Max,Sum, F
from django.contrib.auth.models import User

import csv
import json

def totalMinutosHistorialCompletadosHoy(lista):
    sumlistaHistorialHab = lista.aggregate(Sum('duracion'))['duracion__sum']
    if sumlistaHistorialHab:
    # Convertir la duración total a segundos
        duracion_total_segundos = sumlistaHistorialHab.total_seconds()

        # Calcular horas, minutos y segundos
        horas = duracion_total_segundos // 3600
        minutos = (duracion_total_segundos % 3600) // 60
        segundos = duracion_total_segundos % 60
        
        return {
                "Horas": horas,
                "Minutos": minutos,
                "Segundos": segundos,
                }
        
    else:
        return {
                "Horas": 0,
                "Minutos": 0,
                "Segundos": 0,
                }

            
def totalMinutosHistorialHoy(listaHoy):
    total_minutos = 0
    for habito in listaHoy:
        total_minutos += habito.work_time * habito.count
    
    horas = total_minutos // 60
    minutos = total_minutos % 60
    
    return {
        "Horas": horas,
        "Minutos": minutos,
    }

def listar_habitos(Usuario):
    # fecha_actual = date.today()
    listaHabitos = Usuario.listHabitos.all().order_by('orden_n')
    print(listaHabitos)
    fecha_actual = timezone.now()
    
    # Obtener el día de la semana actual (1=Lunes, 7=Domingo)
    dia_semana_actual = fecha_actual.isoweekday()
    
    # Filtrar hábitos que se deben mostrar hoy
    habitos_hoy = []
    for habito in listaHabitos:
        dias_seleccionados = [int(d) for d in habito.dias_seleccionados.split(',')]
        if dia_semana_actual in dias_seleccionados:
            habitos_hoy.append(habito)
    
    # Separar hábitos hechos y no hechos hoy
    habitosenelhistorial_no_hoy = [h for h in habitos_hoy if not h.listHabitoHistorial.filter(fecha_inicio__date=fecha_actual).exists() and not h.archivado]
    habitosenelhistorial_hoy = [h for h in habitos_hoy if h.listHabitoHistorial.filter(fecha_inicio__date=fecha_actual).exists() and not h.archivado]
    habitosArchivado = listaHabitos.filter(archivado=True).order_by('orden_n')
 
    habitos_No_hechos_hoy = [habito.obtener_valores() for habito in habitosenelhistorial_no_hoy]
    habitos_hechos_hoy = [habito.obtener_valores() for habito in habitosenelhistorial_hoy]
    Lista_habitos_Archivados = [habito.obtener_valores() for habito in habitosArchivado]
    
    # listaHistorialHoy = Historial_habitos.objects.filter(fecha_inicio__date=fecha_actual)
    listaHistorialHoy = Historial_habitos.objects.filter(fk_habito__fk_user=Usuario ,fecha_inicio__date=fecha_actual)
    
    varTotalTiempoHabitoHoyRestante = totalMinutosHistorialHoy(habitosenelhistorial_no_hoy)
    varTotalTiempoHabitoHoyCompletado = totalMinutosHistorialCompletadosHoy(listaHistorialHoy)
    varNumeroTareasRestantes = len(habitosenelhistorial_no_hoy)
    
    context = {
        'Habitos_por_hacer': habitos_No_hechos_hoy,
        'Habitos_hechos': habitos_hechos_hoy,
        'Tiempo_Restante_Hoy': varTotalTiempoHabitoHoyRestante,
        'Numero_Restante_Hoy': varNumeroTareasRestantes,
        'Tiempo_completado_Hoy': varTotalTiempoHabitoHoyCompletado,
        'ListaHArchivados': Lista_habitos_Archivados
    }
    return context
    

def obtener_habitos_restantes_hoy(request):
    context = listar_habitos(request.user)
    # print(context)
    return JsonResponse(context, safe=False)


def home_habitos(request):
    # context = listar_habitos()
    context = {}
    return render(request, 'habitos_app/habitos_home.html', context)


def check_habito(request, habito):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
        print(datos)
        id_habito = habito
        
        habitoAcompletar = Habito.objects.get(id= id_habito)
        print('habitoAcompletar')
        print(habitoAcompletar)
        fechaInicio = timezone.make_aware(datetime.strptime(datos['fechaInicio'], '%Y-%m-%dT%H:%M:%S.%fZ'))
        print('fechaInicio')
        print(fechaInicio)
        fechaFin = timezone.make_aware(datetime.strptime(datos['fechaFin'], '%Y-%m-%dT%H:%M:%S.%fZ'))
        print('fechaFin')
        print(fechaFin)
        duracion = fechaFin - fechaInicio
        print('duracion')
        print(duracion)
        duracionDescanso = timedelta(minutes=datos['duracionDescanso'])
        print('duracionDescanso')
        print(duracionDescanso)
        
        Historial_habitos.objects.create(
            fk_habito_id=id_habito, 
            fecha_inicio=fechaInicio, 
            fecha_fin=fechaFin, 
            duracion=duracion, 
            duracion_descanso=duracionDescanso, 
            )
        
        # Actualizar estadísticas de tag
        fecha_local = timezone.localtime(fechaInicio).date()
        actualizar_estadisticas_tag(habitoAcompletar, duracion, fecha_local)
        
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})


def getHabitosOnly(request):
    
    # objtosHabitos = Habito.objects.all()
    objtosHabitos = request.user.listHabitos.all()
    
    listaHabitos = list(objtosHabitos.values())
    
    context = {
        'listaHabitos': listaHabitos
    }
    return JsonResponse(context, safe=False)

def getHistorialHabito(request, id_habito):
    objetoHistorialHabito = Historial_habitos.objects.filter(fk_habito=id_habito)
    if objetoHistorialHabito:
        lista_HistorialHabito = [historial.obtenerHistorialFormateado() for historial in objetoHistorialHabito ]
        lista_HistorialFechaDuracion = [historial.obtenerHistorialFechaDuracion() for historial in objetoHistorialHabito ]
        # print(lista_HistorialHabito)
        varTotalTimpoHabito = objetoHistorialHabito.first().fk_habito.totalMinutosHabitos()
        varTotalDiasHabito = objetoHistorialHabito.first().fk_habito.cantidadDiasHabito()
    else:
        lista_HistorialHabito = [ ]
        lista_HistorialFechaDuracion = [ ]
        varTotalTimpoHabito = {"Horas": 0, "Minutos": 0, "Segundos": 0, }
        varTotalDiasHabito = 0
        
    
    context = {
        'lista_HistorialHabito': lista_HistorialHabito,
        'data_historial': lista_HistorialFechaDuracion,
        'TotalTiempo': varTotalTimpoHabito,
        'TotalDias': varTotalDiasHabito,
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


def guardar_habito(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)
        id = data.get('id')
        nombre = data.get('nombre')
        comentarios = data.get('comentarios', '')
        work_time = data.get('work_time')
        short_break = data.get('short_break')
        count = data.get('count')
        type = data.get('type')
        orden_n = data.get('orden_n')
        color_hab = data.get('color')
        archivado = data.get('archivado')
        objetivo = data.get('objetivo')
        dias_seleccionados = data.get('dias_seleccionados', '1,2,3,4,5,6,7')  # Valor por defecto si no se proporciona
        tag_ids = data.get('tags', [])  # Lista de IDs de tags

        if id:
            habito = Habito.objects.get(id=id)
            habito.nombre = nombre
            habito.comentarios = comentarios
            habito.work_time = work_time
            habito.short_break = short_break
            habito.count = count
            habito.type = TiposHabitos.objects.get(numero=type)
            habito.orden_n = orden_n
            habito.color = color_hab
            habito.archivado = archivado
            habito.objetivo = objetivo
            habito.dias_seleccionados = dias_seleccionados
            habito.save()
            
            # Actualizar tags
            habito.tags.clear()
            if tag_ids:
                tags = Tag.objects.filter(id__in=tag_ids)
                habito.tags.add(*tags)
        else:
            habito = Habito.objects.create(
                nombre=nombre,
                comentarios=comentarios,
                work_time=work_time,
                short_break=short_break,
                count=count,
                type=TiposHabitos.objects.get(numero=type),
                orden_n=orden_n,
                color=color_hab,
                archivado=archivado,
                objetivo=objetivo,
                dias_seleccionados=dias_seleccionados,
                fk_user=request.user
            )
            
            # Agregar tags al nuevo hábito
            if tag_ids:
                tags = Tag.objects.filter(id__in=tag_ids)
                habito.tags.add(*tags)

        return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})


def set_NewHabitoformHabito(request):
    
    if request.method == 'POST':
        datos = json.loads(request.body)
       
        numero_campo = datos['id']
        nombre = str(datos['nombre']) 
        comentarios = datos.get('comentarios', '')
        work_time = datos['work_time']
        short_break = datos['short_break']
        count = datos['count']
        campo_type =  TiposHabitos.objects.get(numero=datos['type']) 
        color = datos['color']
        objetivo = datos['objetivo']
        tag_ids = datos.get('tags', [])  # Lista de IDs de tags
        
        ultimo_valor_mas_alto = Habito.objects.aggregate(max_valor_mas_alto=Max('orden_n'))['max_valor_mas_alto']
        if ultimo_valor_mas_alto is None:
            nuevo_valor = 1
        else:
            nuevo_valor = ultimo_valor_mas_alto + 1

        habito = Habito.objects.create(
            numero=numero_campo,
            nombre=nombre,
            comentarios=comentarios,
            work_time=work_time,
            short_break=short_break,
            count=count,
            type=campo_type,
            orden_n=nuevo_valor,
            color=color,
            objetivo=objetivo,
            fk_user=request.user
        )
        
        # Agregar tags al nuevo hábito
        if tag_ids:
            tags = Tag.objects.filter(id__in=tag_ids)
            habito.tags.add(*tags)

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
    
def getOneHistorial(request, id_habito):
    if request.method == 'POST':
        datos = json.loads(request.body)
        print(id_habito)
        print(datos)
        fecha = datos['fecha']
        print(fecha)
        
        objeto_habito = Habito.objects.filter(id = id_habito)
        objeto_historial = objeto_habito.first().listHabitoHistorial.filter(fecha_inicio__date = fecha)
        if objeto_historial.exists():
            print(objeto_historial)
            print(type(objeto_historial))
            
            context = {
                'objeto_habito' : objeto_habito.first().obtener_valores(),
                'mensaje': 'Datos recibidos correctamente',
                'objeto_historial' : objeto_historial.first().obtenerHistorialFormateado()
            }
        else: 
            context = {
                'mensaje': 'Datos recibidos correctamente'
            }

        return JsonResponse(context, safe=False)
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})


def editarDuracionForm_Habito(request, id_habito):
    
    if request.method == 'POST':
        
        datos = json.loads(request.body)
        print(datos)
        
        campofecha = datos['fecha']
        campoDuracion = timedelta(hours=int(datos['horas']), minutes=int(datos['minutos']), seconds=int(datos['segundos']))  
        print('--------ooooooooooooo-------')
        print(campofecha)
        print(campoDuracion)
        habitocompleto = Habito.objects.get(id= id_habito)
        objetoHabito = Historial_habitos.objects.filter(fk_habito__id=id_habito,fecha_inicio__date = campofecha)
        
        if not objetoHabito.exists():
            horaVacia = '00:00:00'
            
            fecha_hora_ = timezone.make_aware(datetime.strptime(f'{campofecha} {horaVacia}', '%Y-%m-%d %H:%M:%S'))
            campoDuracionDescanso = timedelta(hours=0, minutes=0, seconds=0)   
            
            Historial_habitos.objects.create(
                    fk_habito_id=id_habito, 
                    fecha_inicio=fecha_hora_, 
                    fecha_fin=fecha_hora_, 
                    duracion=campoDuracion, 
                    duracion_descanso=campoDuracionDescanso, 
                    )
            
            
            # objetoHabito.fk_habito__id = int(id_habito)
            # objetoHabito.fecha_inicio = fecha_hora_
            # objetoHabito.fecha_fin = fecha_hora_
            # objetoHabito.duracion = campoDuracion
            # objetoHabito.duracion_descanso = campoDuracionDescanso
            
            # objetoHabito.save()
            
        else:
            objetoHabito = objetoHabito.first()
       
            # nombre = str(datos['nombre']) 
            # short_break = datos['short_break']
            # count = datos['count']
            # campo_type =  TiposHabitos.objects.get(numero=datos['type']) 
            # #orden_n = datos['orden_n']
            # color = datos['color']
            # objetivo = datos['objetivo']

            objetoHabito.duracion=campoDuracion
            # objetoHabito.nombre=nombre
            # objetoHabito.work_time=work_time
            # objetoHabito.short_break=short_break
            # objetoHabito.count=count
            # objetoHabito.type=campo_type
            # #objetoHabito.orden_n=orden_n
            # objetoHabito.color=color
            # objetoHabito.objetivo=objetivo
            
            print(objetoHabito)
            print(objetoHabito.duracion)
            print(objetoHabito.fk_habito)
            print('1--------ooooooooooooo-------')
            
            
            
            
            objetoHabito.save()
            print(' se guardo')
        context = {
            'objetoHabito': habitocompleto.obtener_valores(),
            'mensaje': 'Datos recibidos correctamente'
        }

        return JsonResponse(context)
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    

def delete_habito(request):

    if request.method == 'POST':
        
        datos = json.loads(request.body)
        print(datos)
        id_habito = int(datos['id']) 
        
        habitoAEliminar = Habito.objects.get(id = id_habito)
        habitoAEliminar.delete()
    
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})
    
def archivar_habito(request):

    if request.method == 'POST':
        
        datos = json.loads(request.body)
        print(datos)
        id_habito = int(datos['id']) 
        
        habitoAEliminar = Habito.objects.get(id = id_habito)
        valorArchivado = habitoAEliminar.archivado
        habitoAEliminar.archivado = not valorArchivado
        habitoAEliminar.save()
    
        return JsonResponse({'mensaje': 'Datos recibidos correctamente'})
    else:
        return JsonResponse({'error': 'Se espera una solicitud POST'})


def get_listHabitos_Sort(request): 
    # listaHabitos_a_ordenar = Habito.objects.filter(archivado=False)
    listaHabitos_a_ordenar =   request.user.listHabitos.filter(archivado=False)
    valoresListaHabitosAordenarJson = [habito.obtener_valores() for habito in listaHabitos_a_ordenar]
    context = {
            'ListHabitosSort': valoresListaHabitosAordenarJson,
            'mensaje': 'Datos recibidos correctamente'
        }
    return JsonResponse(context, safe=False)

# def set_listHabitos_Sort(request): 
#     if request.method == 'POST':
#         data = json.loads(request.body)
#         numero = 0
#         for item in data:
#             habitoAordenar = Habito.objects.get(id = item)
#             habitoAordenar.orden_n = numero
#             habitoAordenar.save()
#             numero += 1
            
#             #print(item)  # Puedes hacer lo que necesites con cada elemento de la lista
#         return JsonResponse({'message': 'Datos recibidos correctamente'})
#     else:
#         return JsonResponse({'message': 'Esta vista solo acepta solicitudes POST'})

def set_listHabitos_Sort(request): 
    if request.method == 'POST':
        data = json.loads(request.body)
        habitos_ids = [item for item in data]
        habitos = Habito.objects.filter(id__in=habitos_ids)

        # Crear un diccionario que mapea los IDs a los objetos Habito
        habitos_dict = {habito.id: habito for habito in habitos}

        # Crear una lista de los objetos Habito en el orden correcto
        habitos_ordenados = [habitos_dict[id] for id in habitos_ids]

        # Actualizar el orden_n de manera secuencial
        for i, habito in enumerate(habitos_ordenados):
            habito.orden_n = i

        # Actualizar todos los hábitos de una vez
        Habito.objects.bulk_update(habitos_ordenados, ['orden_n'])
            
        return JsonResponse({'message': 'Datos recibidos correctamente', 'status': 'success'})
    else:
        return JsonResponse({'message': 'Esta vista solo acepta solicitudes POST', 'status': 'error'})






def import_json_to_sqlite(data, user):
    # file_path = 'data.json'
    # with open(file_path, 'r') as jsonfile:
    #     data = json.load(jsonfile)
    for item in data:
        if 'objetivo' in item:
            objetivo = item['objetivo']
        else: 
            objetivo = 0
        
        tipo = TiposHabitos.objects.get(numero=item['type'])
        Habito.objects.create(
            fk_user = user,
            numero=item['id'], 
            nombre=item['nombre'],
            work_time=item['work_time'],
            short_break=item['short_break'],
            count=item['count'],
            type=tipo,
            orden_n=item['orden_n'],
            color=item['color'],
            objetivo=objetivo,
            progresion=0,
            )





def import_csv_to_sqlite(reader, usuario):
    # file_path = 'historial_habitos.csv'
    # with open(file_path, 'r') as csvfile:
    #     reader = csv.DictReader(csvfile)
    for row in reader:
        
        csv_duracion = row['duracion']
        csv_fecha = row['fecha']
        csv_start_timer = row['start_timer']
        csv_end_timer = row['end_timer']
        csv_d_descanso = row['duracion_descanso']
        
        horaVacia = '00:00:00'
        
        #id
        # print(row['duracion'], row['fecha'], row['start_timer'], row['end_timer'], row['duracion_descanso'], sep=', ')
        # print(row['id_habito'])
        id_habito_numero = row['id_habito']
        id_habito = Habito.objects.filter(numero=id_habito_numero, fk_user= usuario).first()

        if id_habito is not None:
            #duracion
            if csv_duracion:
                if csv_duracion == '0':
                    print('d es cero')
                    csv_duracion = '0:0:0'
                horas, minutos, segundos = map(int, csv_duracion.split(':'))
                duracion_campo = timedelta(hours=horas, minutes=minutos, seconds=segundos)
            else:
                duracion_campo = timedelta(hours=0, minutes=0, seconds=0)
            
            #fecha de inicio
            if csv_start_timer:
                if csv_start_timer == '0':
                    csv_start_timer = '00:00:00'
                fecha_hora_inicio = timezone.make_aware(datetime.strptime(f'{csv_fecha} {csv_start_timer}', '%Y-%m-%d %H:%M:%S'))
            else:
                fecha_hora_inicio = timezone.make_aware(datetime.strptime(f'{csv_fecha} {horaVacia}', '%Y-%m-%d %H:%M:%S'))

            #fecha de fin
            if csv_end_timer:
                if csv_end_timer == '0':
                    csv_end_timer = '00:00:00'
                fecha_hora_fin = timezone.make_aware(datetime.strptime(f'{csv_fecha} {csv_end_timer}', '%Y-%m-%d %H:%M:%S'))
            else:
                fecha_hora_fin = timezone.make_aware(datetime.strptime(f'{csv_fecha} {horaVacia}', '%Y-%m-%d %H:%M:%S'))
                
            #duracion descanso
            if csv_d_descanso:
                if csv_d_descanso == '0':
                    print('es cero')
                    csv_d_descanso = '0:0:0'
                horas, minutos, segundos = map(int, csv_d_descanso.split(':'))
                d_descanso = timedelta(hours=horas, minutes=minutos, seconds=segundos)
            else:
                d_descanso = timedelta(hours=0, minutes=0, seconds=0)
            Historial_habitos.objects.create(
                fk_habito=id_habito, 
                fecha_inicio=fecha_hora_inicio, 
                fecha_fin=fecha_hora_fin, 
                duracion=duracion_campo, 
                duracion_descanso=d_descanso, 
                )
        
        else:
            print(row['id_habito'])
            print('no se encontro ')


def process_csv_file(file):
    # Procesar el archivo CSV
    decoded_file = file.read().decode('utf-8')
    csv_data = csv.reader(decoded_file.splitlines())
    # Suponiendo que la primera fila del CSV contiene los encabezados
    headers = next(csv_data)
    # Convertir el resto del CSV en una lista de diccionarios
    data = [dict(zip(headers, row)) for row in csv_data]
    return data

def process_json_file(file):
    # Procesar el archivo JSON
    decoded_file = file.read().decode('utf-8')
    json_data = json.loads(decoded_file)
    return json_data


def importarArchivos(request):
    if request.method == 'POST' and request.FILES['archivoCSV'] and request.FILES['archivoJSON']:
        usuario = request.user
        print(usuario)
        
        json_file = request.FILES['archivoJSON']
        json_data = process_json_file(json_file)
        print(json_data)
        import_json_to_sqlite(json_data, usuario)
        
        csv_file = request.FILES['archivoCSV']
        csv_data = process_csv_file(csv_file)
        print(csv_data)
        import_csv_to_sqlite(csv_data, usuario)
        
        
        # Imprimir los datos en la consola
        # for row in csv_data:
        #     print(row)

    return render(request,'habitos_app/form_archivos.html')

# Nuevas vistas para la gestión de tags

def get_tags(request):
    """Obtener todos los tags del usuario actual"""
    if request.user.is_authenticated:
        tags = Tag.objects.filter(fk_user=request.user)
        tags_list = [tag.obtener_valores() for tag in tags]
        return JsonResponse({'tags': tags_list})
    return JsonResponse({'error': 'Usuario no autenticado'}, status=401)

def crear_tag(request):
    """Crear un nuevo tag"""
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            nombre = data.get('nombre')
            descripcion = data.get('descripcion', '')
            color = data.get('color', '#CCCCCC')
            
            tag = Tag.objects.create(
                nombre=nombre,
                descripcion=descripcion,
                color=color,
                fk_user=request.user
            )
            
            return JsonResponse({'status': 'success', 'tag': tag.obtener_valores()})
        return JsonResponse({'error': 'Usuario no autenticado'}, status=401)
    return JsonResponse({'error': 'Se espera una solicitud POST'}, status=400)

def editar_tag(request, tag_id):
    """Editar un tag existente"""
    if request.method == 'POST':
        if request.user.is_authenticated:
            data = json.loads(request.body)
            nombre = data.get('nombre')
            descripcion = data.get('descripcion', '')
            color = data.get('color', '#CCCCCC')
            
            try:
                tag = Tag.objects.get(id=tag_id, fk_user=request.user)
                tag.nombre = nombre
                tag.descripcion = descripcion
                tag.color = color
                tag.save()
                
                return JsonResponse({'status': 'success', 'tag': tag.obtener_valores()})
            except Tag.DoesNotExist:
                return JsonResponse({'error': 'Tag no encontrado'}, status=404)
        return JsonResponse({'error': 'Usuario no autenticado'}, status=401)
    return JsonResponse({'error': 'Se espera una solicitud POST'}, status=400)

def eliminar_tag(request, tag_id):
    """Eliminar un tag"""
    if request.method == 'POST':
        if request.user.is_authenticated:
            try:
                tag = Tag.objects.get(id=tag_id, fk_user=request.user)
                tag.delete()
                return JsonResponse({'status': 'success'})
            except Tag.DoesNotExist:
                return JsonResponse({'error': 'Tag no encontrado'}, status=404)
        return JsonResponse({'error': 'Usuario no autenticado'}, status=401)
    return JsonResponse({'error': 'Se espera una solicitud POST'}, status=400)

def get_habitos_por_tag(request, tag_id):
    """Obtener todos los hábitos asociados a un tag específico"""
    if request.user.is_authenticated:
        try:
            tag = Tag.objects.get(id=tag_id, fk_user=request.user)
            habitos = tag.habitos.filter(fk_user=request.user)
            habitos_list = [habito.obtener_valores() for habito in habitos]
            return JsonResponse({'habitos': habitos_list, 'tag': tag.obtener_valores()})
        except Tag.DoesNotExist:
            return JsonResponse({'error': 'Tag no encontrado'}, status=404)
    return JsonResponse({'error': 'Usuario no autenticado'}, status=401)

def get_estadisticas_tag(request, tag_id):
    """Obtener estadísticas de tiempo por tag"""
    if request.user.is_authenticated:
        try:
            tag = Tag.objects.get(id=tag_id, fk_user=request.user)
            habitos = tag.habitos.filter(fk_user=request.user)
            
            # Estadísticas generales
            total_tiempo = timedelta(0)
            total_sesiones = 0
            
            historial_por_fecha = {}
            
            for habito in habitos:
                historial = Historial_habitos.objects.filter(fk_habito=habito)
                for registro in historial:
                    total_tiempo += registro.duracion
                    total_sesiones += 1
                    
                    fecha_str = registro.tranformarTimeZone(registro.fecha_inicio).strftime('%Y-%m-%d')
                    if fecha_str not in historial_por_fecha:
                        historial_por_fecha[fecha_str] = timedelta(0)
                    historial_por_fecha[fecha_str] += registro.duracion
            
            # Convertir a formato presentable
            tiempo_total_segundos = total_tiempo.total_seconds()
            horas = int(tiempo_total_segundos // 3600)
            minutos = int((tiempo_total_segundos % 3600) // 60)
            
            # Convertir historial por fecha a minutos para visualización
            historial_formato = [
                {'fecha': fecha, 'minutos': round(duracion.total_seconds() / 60, 1)}
                for fecha, duracion in historial_por_fecha.items()
            ]
            
            # Ordenar por fecha
            historial_formato.sort(key=lambda x: x['fecha'])
            
            return JsonResponse({
                'tag': tag.obtener_valores(),
                'estadisticas': {
                    'tiempo_total': {
                        'horas': horas,
                        'minutos': minutos
                    },
                    'sesiones_total': total_sesiones,
                    'historial': historial_formato
                }
            })
        except Tag.DoesNotExist:
            return JsonResponse({'error': 'Tag no encontrado'}, status=404)
    return JsonResponse({'error': 'Usuario no autenticado'}, status=401)

# Actualizar estadísticas de tag después de registrar un hábito
def actualizar_estadisticas_tag(habito, duracion, fecha):
    """Actualizar las estadísticas de tags después de registrar un hábito"""
    if habito.tags.exists():
        for tag in habito.tags.all():
            tag_stat, created = TagStats.objects.get_or_create(
                tag=tag,
                fecha=fecha
            )
            tag_stat.tiempo_total += duracion
            tag_stat.save()