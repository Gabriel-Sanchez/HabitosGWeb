from django.db import models
from django.utils import timezone

# Create your models here.

# Create your models here.


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
    
    
    def __str__(self):
        return self.nombre + '-' + str(self.numero) 
    
   
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
            'progresion': self.progresion
        }
    
    
class Historial_habitos(models.Model):
    fk_habito = models.ForeignKey(Habito, on_delete=models.CASCADE)
    fecha_inicio = models.DateTimeField()
    fecha_fin = models.DateTimeField()
    duracion = models.DurationField()
    duracion_descanso = models.DurationField()
    
    def __str__(self):
        return self.fk_habito.nombre + '-' + str(self.fecha_inicio) + str(self.duracion)
    
    def tranformarDuracion(self):
        duracion_minutos = self.duracion.total_seconds() // 60  
        return  int(duracion_minutos)
    
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
            'duracion_descanso' : self.duracion_descanso,
            'fecha': self.fecha_inicio.strftime('%Y-%m-%d')
        }
    def obtenerHistorialFechaDuracion(self):
        return{
            'duracion' : self.tranformarDuracion(),
            'fecha': self.fecha_inicio.strftime('%Y-%m-%d'),
            'id_habito': self.fk_habito.id,
        }
    