# Generated by Django 5.0.7 on 2024-07-23 10:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0002_alter_candidate_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidate',
            name='image',
            field=models.CharField(default='gs://careerconnect-5ad6c.appspot.com/candidates/sample.png', max_length=255),
        ),
        migrations.AlterField(
            model_name='company',
            name='logo',
            field=models.CharField(default='gs://careerconnect-5ad6c.appspot.com/companies/sample.png', max_length=255),
        ),
    ]
