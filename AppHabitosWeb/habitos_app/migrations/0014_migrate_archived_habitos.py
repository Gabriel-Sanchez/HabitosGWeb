from django.db import migrations

def migrate_archived_habits(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Baul = apps.get_model('habitos_app', 'Baul')
    Habito = apps.get_model('habitos_app', 'Habito')

    for user in User.objects.all():
        # Get or create the user's default "General" chest
        default_baul = Baul.objects.filter(nombre="General", fk_user=user).first()
        if not default_baul:
            default_baul = Baul.objects.create(nombre="General", color="#FFFFFF", fk_user=user)
        
        # Link all archived habits belonging to this user that don't have a chest yet
        archived_habits = Habito.objects.filter(fk_user=user, archivado=True, baul__isnull=True)
        for habit in archived_habits:
            habit.baul = default_baul
            habit.save()

def rollback_archived_habits(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('habitos_app', '0013_baul_habito_baul'),
    ]

    operations = [
        migrations.RunPython(migrate_archived_habits, rollback_archived_habits),
    ]
