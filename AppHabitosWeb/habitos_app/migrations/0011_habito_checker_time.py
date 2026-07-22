# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habitos_app', '0010_habito_favorites_and_reminders'),
    ]

    operations = [
        migrations.AddField(
            model_name='habito',
            name='checker_time',
            field=models.IntegerField(default=0),
        ),
    ]
