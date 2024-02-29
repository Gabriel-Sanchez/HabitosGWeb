from django.urls import path
from . import views

urlpatterns = [
    path('getHabitosR/',views.obtener_habitos_restantes_hoy, name='get_habitos_restantes' ),
    path('setHistory/<habito>',views.check_habito, name='check_habito' ),
    path('getHabitosOnly',views.getHabitosOnly, name='check_habito' ),
    path('', views.home_habitos, name='habitos_home'),
]
