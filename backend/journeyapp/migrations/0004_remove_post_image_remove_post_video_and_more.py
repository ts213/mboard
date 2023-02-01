# Generated by Django 4.1.5 on 2023-01-16 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('journeyapp', '0003_alter_post_text'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='image',
        ),
        migrations.RemoveField(
            model_name='post',
            name='video',
        ),
        migrations.RemoveField(
            model_name='post',
            name='videothumb',
        ),
        migrations.AddField(
            model_name='post',
            name='file',
            field=models.ImageField(blank=True, upload_to='post/files/%Y/%m/%d/'),
        ),
    ]