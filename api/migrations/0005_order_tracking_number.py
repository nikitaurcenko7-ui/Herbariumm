from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_ensure_admin_staff'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='tracking_number',
            field=models.CharField(blank=True, db_index=True, max_length=32),
        ),
    ]
