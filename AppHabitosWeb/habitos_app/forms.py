from django import forms
from .models import Habito, Tag


class HabitoForm(forms.ModelForm):
    class Meta:
        model = Habito
        fields = ['id', 'nombre', 'work_time', 'short_break', 'count', 'type', 'orden_n', 'color', 'objetivo', 'progresion', 'tags']
        widgets = {
            'id': forms.HiddenInput(),
            'tags': forms.CheckboxSelectMultiple(),
        }


class TagForm(forms.ModelForm):
    class Meta:
        model = Tag
        fields = ['nombre', 'descripcion', 'color']
