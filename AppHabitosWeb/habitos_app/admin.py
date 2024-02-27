from django.contrib import admin
from .models import Habito, TiposHabitos, Historial_habitos

# Register your models here.

admin.site.register(Habito)
admin.site.register(TiposHabitos)
admin.site.register(Historial_habitos)