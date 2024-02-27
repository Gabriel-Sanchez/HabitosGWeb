from django.db import models

# Create your models here.

# Create your models here.


class TiposHabitos(models.Model):
    nombre = models.CharField(max_length=100)
    numero = models.IntegerField()

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
    
class Historial_habitos(models.Model):
    fk_habito = models.ForeignKey(Habito, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    duracion = models.DurationField()
    duracion_descanso = models.DurationField()