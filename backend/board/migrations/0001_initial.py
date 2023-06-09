# Generated by Django 4.2 on 2023-05-20 19:55

import board.utils
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Board',
            fields=[
                ('link', models.CharField(max_length=5, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=15, unique=True)),
                ('userboard', models.BooleanField(default=True)),
                ('bump', models.DateTimeField(auto_now_add=True, null=True)),
            ],
            options={
                'ordering': ['-bump'],
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('uuid', models.UUIDField(default=uuid.uuid4)),
                ('boards', models.ManyToManyField(related_name='janny', to='board.board')),
            ],
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('closed', models.BooleanField(default=False)),
                ('poster', models.CharField(blank=True, max_length=35)),
                ('text', models.TextField(blank=True, max_length=10000)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('bump', models.DateTimeField(auto_now_add=True, null=True)),
                ('edited_at', models.DateTimeField(blank=True, null=True)),
                ('board', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='board.board')),
                ('thread', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='board.post')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='board.user')),
            ],
            options={
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to=board.utils.get_image_path)),
                ('thumb', models.ImageField(upload_to=board.utils.get_thumb_path)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='images', to='board.post')),
            ],
        ),
    ]
