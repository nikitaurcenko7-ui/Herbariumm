from django.contrib.auth.hashers import make_password
from django.db import migrations


def set_admin_short_login(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    user = (
        User.objects.filter(username='admin@').first()
        or User.objects.filter(email='admin@').first()
        or User.objects.filter(username='admin@herbarium.ru').first()
        or User.objects.filter(email='admin@herbarium.ru').first()
        or User.objects.filter(username='admin').first()
    )

    if user is None:
        user = User(username='admin@')

    user.username = 'admin@'
    user.email = 'admin@'
    user.first_name = 'admin'
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.password = make_password('password')
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_restore_django_admin_credentials'),
    ]

    operations = [
        migrations.RunPython(set_admin_short_login, migrations.RunPython.noop),
    ]
