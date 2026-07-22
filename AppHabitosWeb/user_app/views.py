from django import setup
from django.http import request
from django.shortcuts import render

from django.contrib.auth import authenticate,login,logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User
from .models import Profile
from .forms import ProfileForm, ProfileFormImage, ProfileFormPass,ProfileFormUserE, ProfileFormHorarioDia

from django.db.utils import IntegrityError
from django.http import JsonResponse


def update_profile(request):
    request_user = request.user
    Obj_user = User.objects.get(username=request_user)
    profile =Profile.objects.get(user = Obj_user)

    if request.method == "POST":

        form = ProfileForm(request.POST, request.FILES)
        if form.is_valid():
            data = form.cleaned_data

            Obj_user.first_name = data['firstname']
            Obj_user.last_name = data['lastname']
        
            Obj_user.save()
            profile.save()

            print(form.cleaned_data)
            return redirect('habitos_home')

        form_image = ProfileFormImage(request.POST, request.FILES)
        if form_image.is_valid():
            data = form_image.cleaned_data

            profile.picture = data['picture']

            profile.save()

            print(form_image.cleaned_data)
            return redirect('habitos_home')

        FormPass = ProfileFormPass(request.POST, request.FILES)
        if FormPass.is_valid():
            data = FormPass.cleaned_data

            currentPass = request.POST['currentPass']
            newPass = request.POST['newPass']
            confirmPass = request.POST['confirmPass']


            if not(Obj_user.check_password(currentPass)):
                return render(request=request, template_name='users/update_profile.html',
                context={'profile': profile, 'user': request.user, 'form':form, 'error': 'Password no coincide'} )

            elif newPass != confirmPass:
                return render(request=request, template_name='users/update_profile.html',
                context={'profile': profile, 'user': request.user, 'form':form, 'error': 'Passwords no coinciden'} )

            else:
                Obj_user.set_password(newPass)
                Obj_user.save()

            print(FormPass.cleaned_data)
            return redirect('logout')

        FormUserE = ProfileFormUserE(request.POST, request.FILES)
        if FormUserE.is_valid():
            data = FormUserE.cleaned_data

            Obj_user.email = request.POST['email']
            Obj_user.username = request.POST['username']

            try:
                Obj_user.save()
            except IntegrityError:
                form = ProfileForm()
                return render(request=request, template_name='users/update_profile.html',
                context={'profile': profile, 'user': request.user, 'form':form, 'error_usuario': 'usuario ya existe'} )

            print(FormUserE.cleaned_data)
            return redirect('habitos_home')
            
        # Manejar configuración de horario del día
        FormHorarioDia = ProfileFormHorarioDia(request.POST)
        if FormHorarioDia.is_valid():
            data = FormHorarioDia.cleaned_data
            
            profile.inicio_dia = data['inicio_dia']
            profile.fin_dia = data['fin_dia']
            profile.save()
            
            print(FormHorarioDia.cleaned_data)
            return redirect('habitos_home')
    else:
        form = ProfileForm()

    return render(request=request, template_name='users/update_profile.html',
    context={'profile': profile, 'user': request.user, 'form':form} )


@login_required
def get_user_config(request):
    """Obtener la configuración del usuario en formato JSON"""
    try:
        profile = Profile.objects.get(user=request.user)
        return JsonResponse({
            'inicio_dia': profile.inicio_dia.strftime('%H:%M'),
            'fin_dia': profile.fin_dia.strftime('%H:%M'),
            'status': 'success'
        })
    except Profile.DoesNotExist:
        return JsonResponse({
            'inicio_dia': '00:00',  # valor por defecto
            'fin_dia': '23:59',  # valor por defecto
            'status': 'success'
        })
    except Exception as e:
        return JsonResponse({
            'error': str(e),
            'status': 'error'
        })


def details_profile(request):
    nombre_usuario = request.user
    profile = Profile.objects.get(user = nombre_usuario)

    context={
        'profile': profile,
        }
    return render(request, 'users/details_profile.html', context )



def login_view(request):
    if request.method == 'POST':
        if request.content_type == 'application/json':
            import json
            datos = json.loads(request.body)
            username = datos.get('username')
            password = datos.get('password')
        else:
            username = request.POST.get('username')
            password = request.POST.get('password')

        is_api = 'okhttp' in request.headers.get('User-Agent', '').lower() or request.headers.get('Accept') == 'application/json'

        if not username or not password:
            error_msg = 'Nombre de usuario y contraseña son obligatorios'
            if is_api:
                return JsonResponse({'error': error_msg}, status=400)
            return render(request, 'users/login.html', {'error': error_msg})

        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            if is_api:
                return JsonResponse({'status': 'success', 'message': 'Sesión iniciada correctamente'})
            return redirect("habitos_home")
        else:
            error_msg = 'Nombre de usuario o contraseña incorrectos'
            if is_api:
                return JsonResponse({'error': error_msg}, status=400)
            return render(request, 'users/login.html', {'error': error_msg})
    return render(request, 'users/login.html')


@login_required
def logout_view(request):
    logout(request)
    return redirect('login')


def signup(request):
    if request.method == 'POST':
        if request.content_type == 'application/json':
            import json
            datos = json.loads(request.body)
            first_name = datos.get('First_name')
            username = datos.get('username')
            password = datos.get('password')
            password_confirmation = datos.get('password_confirmation')
            email = datos.get('email')
        else:
            first_name = request.POST.get('First_name')
            username = request.POST.get('username')
            password = request.POST.get('password')
            password_confirmation = request.POST.get('password_confirmation')
            email = request.POST.get('email')

        is_api = 'okhttp' in request.headers.get('User-Agent', '').lower() or request.headers.get('Accept') == 'application/json'

        if not first_name or not password or not password_confirmation or not email:
            error_msg = 'Todos los campos son obligatorios'
            if is_api:
                return JsonResponse({'error': error_msg}, status=400)
            return render(request, 'users/signup.html', {'error': error_msg})

        if password != password_confirmation:
            error_msg = 'Las contraseñas no coinciden'
            if is_api:
                return JsonResponse({'error': error_msg}, status=400)
            return render(request, 'users/signup.html', {'error': error_msg})

        # Si el usuario especificó un username personalizado, lo usamos; si no, usamos su nombre de pila
        final_username = username if username and username.strip() else first_name

        try:
            user = User.objects.create_user(username=final_username, password=password)
        except IntegrityError:
            error_msg = 'El nombre de usuario ya está en uso'
            if is_api:
                return JsonResponse({'error': error_msg}, status=400)
            return render(request, 'users/signup.html', {'error': error_msg})

        user.first_name = first_name
        user.email = email
        user.save()
        
        profile = Profile(user=user)
        profile.save()

        if is_api:
            return JsonResponse({'status': 'success', 'message': 'Usuario registrado exitosamente'})
        return redirect('login')
    return render(request, 'users/signup.html')

