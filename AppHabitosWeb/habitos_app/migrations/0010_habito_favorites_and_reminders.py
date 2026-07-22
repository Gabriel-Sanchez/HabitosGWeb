# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habitos_app', '0009_habito_time_fields_and_subtarea'),
    ]

    operations = [
        migrations.AddField(
            model_name='habito',
            name='es_favorito',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='habito',
            name='reminder_hora',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='habito',
            name='reminder_minuto',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
        migrations.AddField(
            model_name='habito',
            name='reminder_enabled',
            field=models.BooleanField(default=False),
        ),
    ]
