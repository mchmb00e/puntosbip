# Generated by Django 5.0.6 on 2024-06-14 19:21

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Point',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField()),
                ('codigo', models.CharField(max_length=20)),
                ('entidad', models.TextField()),
                ('direccion', models.TextField()),
                ('comuna', models.TextField()),
                ('horario', models.TextField()),
                ('longitud', models.FloatField()),
                ('latitud', models.FloatField()),
                ('categoria', models.IntegerField()),
                ('funciones', models.TextField()),
            ],
        ),
    ]
