# Generated by Django 4.2 on 2023-05-31 08:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='board',
            name='title',
            field=models.CharField(max_length=16, unique=True),
        ),
    ]