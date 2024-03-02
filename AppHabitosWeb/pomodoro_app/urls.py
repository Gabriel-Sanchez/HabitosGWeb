from django.urls import path
from . import views

urlpatterns = [
    path('pomo_ven/<id_habito>', views.ventana_pomodoro, name='ventana_pomodoro')
]
