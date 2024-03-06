
from django import forms

class ProfileForm(forms.Form):
    firstname = forms.CharField(max_length=30, required=True)
    lastname = forms.CharField(max_length=30, required=True)

class ProfileFormImage(forms.Form):
    picture = forms.ImageField()

class ProfileFormPass(forms.Form):
    currentPass = forms.CharField(max_length=500, required=True)
    newPass = forms.CharField(max_length=500, required=True)
    confirmPass = forms.CharField(max_length=500, required=True)

class ProfileFormUserE(forms.Form):
    username = forms.CharField(max_length=100, required=True)
    email = forms.CharField(max_length=100, required=True)