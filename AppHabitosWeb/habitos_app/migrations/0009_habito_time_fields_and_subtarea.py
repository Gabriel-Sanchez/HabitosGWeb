# Generated manually

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('habitos_app', '0008_habito_comentarios'),
    ]

    operations = [
        migrations.AddField(
            model_name='habito',
            name='hora_inicio',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='habito',
            name='hora_limite',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.CreateModel(
            name='Subtarea',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=150)),
                ('fecha_completada', models.DateField(blank=True, null=True)),
                ('fk_habito', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subtareas', to='habitos_app.habito')),
            ],
        ),
    ]
