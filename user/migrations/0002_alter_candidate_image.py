# Generated by Django 5.0.7 on 2024-07-23 09:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='image',
            field=models.CharField(default='candidates/sample.png', max_length=255),
        ),
    ]
