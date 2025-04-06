from django.urls import path
from . import views

urlpatterns = [
    path('getHabitosR/',views.obtener_habitos_restantes_hoy, name='get_habitos_restantes' ),
    path('setHistory/<habito>',views.check_habito, name='check_habito' ),
    path('getHabitosOnly',views.getHabitosOnly, name='check_habito' ),
    path('getHistorialHabito/<id_habito>',views.getHistorialHabito, name='getHistorialHabito' ),
    path('getHistorialHabitosBar/<id_habito>',views.getHistorialHabito, name='getHistorialHabito' ),
    path('', views.home_habitos, name='habitos_home'),
    #path('set_formHabito/<id_habito>', views.guardar_formulario_Habito, name='guardar_formulario_Habito'),
    path('set_NewHabitoformHabito/', views.set_NewHabitoformHabito, name='set_NewHabitoformHabito'),
    path('archivarHabito/<id_habito>', views.archivarHabito, name='archivarHabito'),
    path('getOneHistorial/<id_habito>', views.getOneHistorial, name='getOneHistorial'),
    path('editarDuracionForm_Habito/<id_habito>', views.editarDuracionForm_Habito, name='editarDuracionForm_Habito'),
    path('delete_habito/', views.delete_habito, name='delete_habito'),
    path('archivar_habito/', views.archivar_habito, name='archivar_habito'),
    path('get_listHabitos_Sort/', views.get_listHabitos_Sort, name='get_listHabitos_Sort'),
    path('set_listHabitos_Sort/', views.set_listHabitos_Sort, name='set_listHabitos_Sort'),
    path('importarArchivos/', views.importarArchivos, name='importarArchivos'),
    path('guardar_habito/', views.guardar_habito, name='guardar_habito'),
    path('getHistorialHabito/<int:id_habito>', views.getHistorialHabito, name='getHistorialHabito'),
]
