from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=120)),
                ('category', models.CharField(max_length=80)),
                ('form', models.CharField(max_length=60)),
                ('price', models.PositiveIntegerField()),
                ('popular', models.BooleanField(default=False)),
                ('tone', models.CharField(default='from-lime-200 to-emerald-500', max_length=80)),
                ('description', models.TextField(blank=True)),
            ],
            options={'ordering': ['id']},
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=120)),
                ('phone', models.CharField(max_length=40)),
                ('city', models.CharField(max_length=120)),
                ('address', models.CharField(max_length=255)),
                ('comment', models.TextField(blank=True)),
                ('payload', models.JSONField(blank=True, default=dict)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
