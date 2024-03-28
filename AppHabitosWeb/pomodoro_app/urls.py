from django.urls import path
from . import views

urlpatterns = [
    path('pomo_ven/<id_habito>', views.ventana_pomodoro, name='ventana_pomodoro'),
    path('stopWatch/<id_habito>', views.ventana_stopwatch, name='ventana_stopwatch'),
    path('set_Inicio_Habito/', views.set_Inicio_Habito, name='set_Inicio_Habito'),
    path('set_tiempo_Habito/', views.set_tiempo_Habito, name='set_tiempo_Habito'),
    path('set_descanso_Habito/', views.set_descanso_Habito, name='set_descanso_Habito'),
    path('set_fin_Habito/', views.set_fin_Habito, name='set_fin_Habito'),
]
