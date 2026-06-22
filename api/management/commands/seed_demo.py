from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import BaseCommand

from api.models import Product


class Command(BaseCommand):
    help = 'Load demo products and create demo admin user.'

    def handle(self, *args, **options):
        if not Product.objects.exists():
            call_command('loaddata', 'products', verbosity=0)

        user, created = User.objects.get_or_create(
            username='admin@herbarium.ru',
            defaults={'email': 'admin@herbarium.ru', 'first_name': 'admin'},
        )
        user.email = 'admin@herbarium.ru'
        user.first_name = 'admin'
        user.is_staff = True
        user.is_superuser = True
        user.set_password('password')
        user.save()

        self.stdout.write(self.style.SUCCESS('Demo data is ready. Login: admin@herbarium.ru / password'))
