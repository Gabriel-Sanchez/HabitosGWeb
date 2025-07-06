from django.db import models

# Create your models here.
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    picture = models.ImageField(
        upload_to = "userimage",
        blank= True, null= True
    )
    fin_dia = models.TimeField(
        default='23:59',
        help_text="Hora de fin del día para cálculos de tiempo restante"
    )
    
    def __str__(self):
        return self.user.username
