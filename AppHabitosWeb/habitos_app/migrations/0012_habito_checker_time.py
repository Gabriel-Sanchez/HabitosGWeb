# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habitos_app', '0011_alter_habito_hora_inicio_alter_habito_hora_limite'),
    ]

    operations = [
        migrations.AddField(
            model_name='habito',
            name='checker_time',
            field=models.IntegerField(default=0),
        ),
    ]
