# Generated by Django 5.0.6 on 2024-06-14 20:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='point',
            name='index',
        ),
        migrations.AlterField(
            model_name='point',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
