from django.contrib.auth.hashers import make_password
from django.db import migrations


def restore_django_admin_credentials(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    user = (
        User.objects.filter(username='admin@herbarium.ru').first()
        or User.objects.filter(email='admin@herbarium.ru').first()
        or User.objects.filter(username='admin@').first()
        or User.objects.filter(username='admin').first()
    )

    if user is None:
        user = User(username='admin@herbarium.ru')

    user.username = 'admin@herbarium.ru'
    user.email = 'admin@herbarium.ru'
    user.first_name = 'admin'
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.password = make_password('password')
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_update_admin_credentials'),
    ]

    operations = [
        migrations.RunPython(restore_django_admin_credentials, migrations.RunPython.noop),
    ]
