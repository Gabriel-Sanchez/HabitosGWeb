from django.db import models
from datetime import timedelta, date
from django.db.models import Sum
from django.contrib.auth.models import User
from django.utils import timezone

class TiposHabitos(models.Model):
    nombre = models.CharField(max_length=100)
    numero = models.IntegerField()
    
    def __str__(self):
        return self.nombre
    

class Tag(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=200, blank=True, null=True)
    color = models.CharField(max_length=7, default='#CCCCCC')
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_tags', null=True)
    
    def __str__(self):
        return self.nombre
        
    def obtener_valores(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'color': self.color
        }
    

class Habito(models.Model):
    numero = models.IntegerField()
    nombre = models.CharField(max_length=150)
    work_time = models.IntegerField()
    short_break = models.IntegerField()
    count = models.IntegerField()
    type = models.ForeignKey(TiposHabitos, on_delete=models.CASCADE)
    orden_n = models.IntegerField()
    color = models.CharField(max_length=7,default='FFFFFF')
    objetivo = models.IntegerField(default=0)
    progresion = models.IntegerField(default=0)
    archivado = models.BooleanField(default=False)
    fk_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='listHabitos', null=True)
    dias_seleccionados = models.CharField(max_length=20, default='1,2,3,4,5,6,7')  # 1=Lunes, 7=Domingo
    tags = models.ManyToManyField(Tag, related_name='habitos', blank=True)
    
    def __str__(self):
        return self.nombre + '-' + str(self.numero) 
    
    def racha_dias(self):
        fechas_ordenadas = self.listHabitoHistorial.all().order_by('-fecha_inicio')
        dias_seleccionados = [int(d) for d in self.dias_seleccionados.split(',')]
        
        dia_hoy = timezone.localtime(timezone.now()).date() 
        
        numero_racha = 0
        if fechas_ordenadas:
            if timezone.localtime(fechas_ordenadas[0].fecha_inicio).date() == dia_hoy:
                fecha_anterior = dia_hoy + timedelta(days=1)
            else:
                fecha_anterior = dia_hoy

        for elemento in fechas_ordenadas:
            fecha_actual = timezone.localtime(elemento.fecha_inicio).date()
            dia_semana_actual = fecha_actual.isoweekday()
            
            # Si el día actual no está seleccionado, continuamos con el siguiente
            if dia_semana_actual not in dias_seleccionados:
                continue
                
            # Calculamos la diferencia de días
            diferencia_dias = (fecha_anterior - fecha_actual).days
            
            # Si la diferencia es 1, es un día consecutivo
            if diferencia_dias == 1:
                numero_racha += 1
            else:
                # Si no es consecutivo, verificamos si hay días no seleccionados entre medio
                dias_intermedios = []
                for i in range(1, diferencia_dias):
                    fecha_intermedia = fecha_anterior - timedelta(days=i)
                    dia_semana_intermedio = fecha_intermedia.isoweekday()
                    if dia_semana_intermedio in dias_seleccionados:
                        dias_intermedios.append(fecha_intermedia)
                
                # Si hay días seleccionados faltantes, rompemos la racha
                if dias_intermedios:
                    if numero_racha == 0:
                        racha_negativa = fecha_anterior - fecha_actual
                        numero_racha = -racha_negativa.days
                    break
                else:
                    # Si no hay días seleccionados faltantes, continuamos la racha
                    numero_racha += 1
                    
            fecha_anterior = fecha_actual

        return numero_racha
 
    def obtener_valores(self):
        tag_list = [{"id": tag.id, "nombre": tag.nombre, "color": tag.color} for tag in self.tags.all()]
        return {
            'id': self.id,
            'type__numero': self.type.numero,
            'nombre': self.nombre,
            'work_time': self.work_time,
            'short_break': self.short_break,
            'count': self.count,
            'orden_n': self.orden_n,
            'color': self.color,
            'objetivo': self.objetivo,
            'progresion': self.progresion,
            'archivado': int(self.archivado),
            'racha': self.racha_dias(),
            'dias_seleccionados': self.dias_seleccionados,
            'tags': tag_list
        }
        
    def totalMinutosHabitos(self):
        sumlistaHistorialHab = self.listHabitoHistorial.all().aggregate(Sum('duracion'))['duracion__sum']
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
    
    def cantidadDiasHabito(self):
        cantidadTodalListaHistorialHab = self.listHabitoHistorial.all().count()
        return cantidadTodalListaHistorialHab
        

class Historial_habitos(models.Model):
    fk_habito = models.ForeignKey(Habito, on_delete=models.CASCADE, related_name='listHabitoHistorial')
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    duracion = models.DurationField()
    duracion_descanso = models.DurationField()
    
    def __str__(self):
        return self.fk_habito.nombre + '-' + str(self.fecha_inicio) + str(self.duracion)
    
    def tranformarDuracion(self):
        duracion_minutos =  self.duracion.total_seconds() / 60  
        duracion_minutos = round(duracion_minutos, 2)
        return  duracion_minutos
    
    def tranformar_descanso(self):
        duracion_minutos =  self.duracion_descanso.total_seconds() / 60  
        duracion_minutos = round(duracion_minutos, 2)
        return  duracion_minutos
    
    def tranformarfecha(self):
        fecha_transformada = self.fecha_inicio.date()  
        return fecha_transformada
    
    def tranformarTimeZone(self, date):
        local_datetime = timezone.localtime(date)
        return local_datetime
        
    
    def obtenerHistorialFormateado(self):
        return {
            'id': self.id,
            'id_habito' : self.fk_habito.id,
            'fecha_inicio' : self.tranformarTimeZone(self.fecha_inicio).date(),
            'fecha_fin' : self.fecha_fin,
            'duracion' : self.tranformarDuracion(),
            'duracion_descanso' : self.tranformar_descanso(),
            'fecha': self.fecha_inicio.strftime('%Y-%m-%d'),
            'hora_fin': self.tranformarTimeZone(self.fecha_fin).time(),
            'hora_inicio': self.tranformarTimeZone(self.fecha_inicio).time(),
        }
    def obtenerHistorialFechaDuracion(self):
        return{
            'duracion' : self.tranformarDuracion(),
            'fecha': self.tranformarTimeZone(self.fecha_inicio).strftime('%Y-%m-%d'),
            'id_habito': self.fk_habito.id,
        }


class TagStats(models.Model):
    """Modelo para almacenar estadísticas de tiempo por tags"""
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='stats')
    fecha = models.DateField()
    tiempo_total = models.DurationField(default=timedelta(0))
    
    class Meta:
        unique_together = ('tag', 'fecha')
        
    def __str__(self):
        return f"{self.tag.nombre} - {self.fecha} - {self.tiempo_total}"
    
    def tiempo_en_minutos(self):
        return self.tiempo_total.total_seconds() / 60
        
        
    