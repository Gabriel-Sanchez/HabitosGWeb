from django.contrib import admin
from .models import Habito, TiposHabitos, Historial_habitos

# Register your models here.

class habitosAdimin(admin.ModelAdmin):
    list_display = ('nombre', 'fk_user')
    list_filter = ('fk_user',)
    

admin.site.register(Habito, habitosAdimin)
admin.site.register(TiposHabitos)
admin.site.register(Historial_habitos)