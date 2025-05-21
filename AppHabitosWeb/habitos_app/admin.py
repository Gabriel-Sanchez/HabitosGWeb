from django.contrib import admin
from .models import Habito, TiposHabitos, Historial_habitos, Tag, TagStats

# Register your models here.

class habitosAdimin(admin.ModelAdmin):
    list_display = ('nombre', 'fk_user')
    list_filter = ('fk_user', 'tags')
    filter_horizontal = ('tags',)

class TagAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'color', 'fk_user')
    list_filter = ('fk_user',)
    search_fields = ('nombre',)

class TagStatsAdmin(admin.ModelAdmin):
    list_display = ('tag', 'fecha', 'tiempo_total', 'tiempo_en_minutos')
    list_filter = ('tag', 'fecha')
    date_hierarchy = 'fecha'

admin.site.register(Habito, habitosAdimin)
admin.site.register(TiposHabitos)
admin.site.register(Historial_habitos)
admin.site.register(Tag, TagAdmin)
admin.site.register(TagStats, TagStatsAdmin)