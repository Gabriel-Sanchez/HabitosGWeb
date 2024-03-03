from django import forms
from .models import Habito


class HabitoForm(forms.ModelForm):
    class Meta:
        model = Habito
        fields = [ 'id','nombre', 'work_time', 'short_break', 'count', 'type', 'orden_n', 'color', 'objetivo', 'progresion']
        widgets = {
            'id': forms.HiddenInput(),
        }
