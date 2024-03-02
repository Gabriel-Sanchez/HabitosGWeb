from django.shortcuts import render

# Create your views here.


def ventana_pomodoro(request, id_habito):
    context = {
        'id': id_habito
    }
    return render(request, 'pomodoro_app/pomodoro.html', context)