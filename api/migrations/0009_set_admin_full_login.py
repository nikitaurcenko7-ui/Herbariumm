from django.contrib.auth.hashers import make_password
from django.db import migrations


def set_admin_full_login(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    full_user = User.objects.filter(username='admin@herbarium.ru').first() or User.objects.filter(email='admin@herbarium.ru').first()
    short_user = User.objects.filter(username='admin@').first() or User.objects.filter(email='admin@').first()
    user = full_user or short_user or User.objects.filter(username='admin').first()

    if user is None:
        user = User(username='admin@herbarium.ru')

    if full_user is not None and short_user is not None and full_user.pk != short_user.pk:
        short_user.username = f'old-admin-{short_user.pk}'
        short_user.email = ''
        short_user.is_staff = False
        short_user.is_superuser = False
        short_user.save()
        user = full_user

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
        ('api', '0008_set_admin_short_login'),
    ]

    operations = [
        migrations.RunPython(set_admin_full_login, migrations.RunPython.noop),
    ]
