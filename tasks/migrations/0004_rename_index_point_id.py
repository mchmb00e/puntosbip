# Generated by Django 5.0.6 on 2024-06-14 20:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_rename_id_point_index'),
    ]

    operations = [
        migrations.RenameField(
            model_name='point',
            old_name='index',
            new_name='id',
        ),
    ]
