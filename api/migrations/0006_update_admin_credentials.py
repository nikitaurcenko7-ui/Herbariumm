from django.contrib.auth.hashers import make_password
from django.db import migrations


def update_admin_credentials(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    user = (
        User.objects.filter(username='admin@').first()
        or User.objects.filter(username='admin').first()
        or User.objects.filter(email='admin@herbarium.ru').first()
    )

    if user is None:
        user = User(username='admin@')

    user.username = 'admin@'
    user.email = 'admin@'
    user.first_name = 'admin'
    user.is_staff = True
    user.is_superuser = True
    user.is_active = True
    user.password = make_password('1234')
    user.save()


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_order_tracking_number'),
    ]

    operations = [
        migrations.RunPython(update_admin_credentials, migrations.RunPython.noop),
    ]
