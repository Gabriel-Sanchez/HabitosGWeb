# Generated by Django 4.2.11 on 2025-05-21 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('habitos_app', '0007_tag_habito_tags_tagstats'),
    ]

    operations = [
        migrations.AddField(
            model_name='habito',
            name='comentarios',
            field=models.TextField(blank=True, null=True),
        ),
    ]
