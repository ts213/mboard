# Generated by Django 4.2 on 2023-05-31 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0002_alter_board_title'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='global_janny',
            field=models.BooleanField(default=False),
        ),
    ]
