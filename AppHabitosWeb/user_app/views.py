from django import setup
from django.http import request
from django.shortcuts import render

from django.contrib.auth import authenticate,login,logout
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from django.contrib.auth.models import User
from .models import Profile
from .forms import ProfileForm, ProfileFormImage, ProfileFormPass,ProfileFormUserE, ProfileFormFinDia

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
            
        # Manejar configuración de fin de día
        FormFinDia = ProfileFormFinDia(request.POST)
        if FormFinDia.is_valid():
            data = FormFinDia.cleaned_data
            
            profile.fin_dia = data['fin_dia']
            profile.save()
            
            print(FormFinDia.cleaned_data)
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
            'fin_dia': profile.fin_dia.strftime('%H:%M'),
            'status': 'success'
        })
    except Profile.DoesNotExist:
        return JsonResponse({
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
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user:
            login(request, user)
            return redirect("habitos_home")
        else:
            return render(request, 'users/login.html', {'error': ' Nombre de usuario o contraseña incorrectas'} )
    return render(request, 'users/login.html')


@login_required
def logout_view(request):
    logout(request)
    return redirect('login')


def signup(request):
    if request.method == 'POST':
        First_name = request.POST['First_name']
        username = First_name
        password = request.POST['password']
        password_confirmation = request.POST['password_confirmation']

        if password != password_confirmation:
            return render(request, 'users/signup.html', {'error': 'Password confirmation does not match'})
        try:
            user = User.objects.create_user(username=username, password=password)
        except IntegrityError:
            return render(request, 'users/signup.html', {'error': 'username is already in user'})

        user.first_name = request.POST['First_name']
        user.email = request.POST['email']
        user.save()
        
        profile = Profile(user=user)
        profile.save()

        return redirect('login')
    return render(request, 'users/signup.html')

