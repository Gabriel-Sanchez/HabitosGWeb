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
    
    
    def __str__(self):
        return self.nombre + '-' + str(self.numero) 
    
    def racha_dias(self):
        fechas_ordenadas = self.listHabitoHistorial.all().order_by('-fecha_inicio')
        
        numero_racha = 0
        if fechas_ordenadas:
            if fechas_ordenadas[0].fecha_inicio.date() == date.today():
                # fecha_anterior =  date.today() + timedelta(days=1)  
                fecha_anterior =  timezone.now().date() + timedelta(days=1)  
            else:
                # fecha_anterior =  date.today()
                fecha_anterior =  timezone.now().date()

        for elemento in fechas_ordenadas:
            fecha_actual = elemento.fecha_inicio.date()  
            #print( fecha_anterior , "-" , fecha_actual , '=' , fecha_anterior - fecha_actual == timedelta(days=1))
            if fecha_anterior - fecha_actual == timedelta(days=1):
                numero_racha += 1  
                # print(numero_racha)
            else:
                break  
            fecha_anterior = fecha_actual

        return numero_racha
 
    def obtener_valores(self):
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
            'racha': self.racha_dias()
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
        
    
    def obtenerHistorialFormateado(self):
        return {
            'id': self.id,
            'id_habito' : self.fk_habito.id,
            'fecha_inicio' : self.fecha_inicio.date(),
            'fecha_fin' : self.fecha_fin,
            'duracion' : self.tranformarDuracion(),
            'duracion_descanso' : self.tranformar_descanso(),
            'fecha': self.fecha_inicio.strftime('%Y-%m-%d'),
            'hora_fin': self.fecha_fin.time(),
            'hora_inicio': self.fecha_inicio.time(),
        }
    def obtenerHistorialFechaDuracion(self):
        return{
            'duracion' : self.tranformarDuracion(),
            'fecha': self.fecha_inicio.strftime('%Y-%m-%d'),
            'id_habito': self.fk_habito.id,
        }
    