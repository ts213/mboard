# Generated by Django 4.1.4 on 2022-12-26 14:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journeyapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='text',
            field=models.TextField(max_length=111),
        ),
    ]