from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import Product


PRODUCTS = [
    ('Алтайский сбор', 'Для иммунитета', 'Рассыпной', 460, True, 'from-lime-200 to-emerald-500', 'Мягкий сбор для ежедневного чаепития.'),
    ('Таежная мята', 'Ароматные травы', 'Сушёный', 320, True, 'from-emerald-200 to-teal-500', 'Свежая мята с выраженным прохладным ароматом.'),
    ('Сонный вечер', 'Для сна', 'Рассыпной', 540, False, 'from-amber-100 to-green-500', 'Спокойная вечерняя смесь без резких нот.'),
    ('Иммунный баланс', 'Для иммунитета', 'Чайные пакетики', 610, True, 'from-green-100 to-lime-600', 'Сбор для сезонной поддержки организма.'),
    ('Лесной тонус', 'Для энергии', 'Рассыпной', 590, False, 'from-cyan-100 to-emerald-500', 'Тонизирующая смесь с хвойным оттенком.'),
    ('Липовый вечер', 'Для сна', 'Чайные пакетики', 390, True, 'from-yellow-100 to-lime-500', 'Липа и травы для мягкого вечернего вкуса.'),
    ('Северная ромашка', 'Цветы', 'Сушёный', 470, False, 'from-white to-green-400', 'Ромашка ручной сортировки.'),
    ('Горный воздух', 'Для энергии', 'Рассыпной', 680, False, 'from-sky-100 to-teal-500', 'Ароматный сбор с чистым травяным профилем.'),
    ('Мятный баланс', 'Ароматные травы', 'Рассыпной', 520, True, 'from-teal-100 to-emerald-400', 'Мята, мелисса и легкая травяная база.'),
]


class Command(BaseCommand):
    help = 'Create demo products and demo user.'

    def handle(self, *args, **options):
        for title, category, form, price, popular, tone, description in PRODUCTS:
            Product.objects.update_or_create(
                title=title,
                defaults={
                    'category': category,
                    'form': form,
                    'price': price,
                    'popular': popular,
                    'tone': tone,
                    'description': description,
                },
            )

        user, created = User.objects.get_or_create(
            username='admin',
            defaults={'email': 'admin@herbarium.ru', 'first_name': 'admin'},
        )
        user.email = 'admin@herbarium.ru'
        user.first_name = 'admin'
        user.is_staff = True
        user.is_superuser = True
        user.set_password('password')
        user.save()

        self.stdout.write(self.style.SUCCESS('Demo data is ready. Login: admin@herbarium.ru / password'))
