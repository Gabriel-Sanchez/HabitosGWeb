from django.urls import path
from . import views

urlpatterns = [
    path('getHabitosR/',views.obtener_habitos_restantes_hoy, name='get_habitos_restantes' ),
    path('setHistory/<habito>',views.check_habito, name='check_habito' ),
    path('getHabitosOnly',views.getHabitosOnly, name='check_habito' ),
    path('getHistorialHabito/<id_habito>',views.getHistorialHabito, name='getHistorialHabito' ),
    path('getHistorialHabitosBar/<id_habito>',views.getHistorialHabito, name='getHistorialHabito' ),
    path('', views.home_habitos, name='habitos_home'),
    path('set_formHabito/<id_habito>', views.guardar_formulario_Habito, name='guardar_formulario_Habito'),
    path('set_NewHabitoformHabito/', views.set_NewHabitoformHabito, name='set_NewHabitoformHabito'),
]
