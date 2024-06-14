from django.db import models

# Create your models here.

class Point(models.Model):
    id = models.IntegerField(primary_key=True)
    codigo = models.CharField(max_length=20)
    entidad = models.TextField()
    direccion = models.TextField()
    comuna = models.TextField()
    horario = models.TextField()
    longitud = models.FloatField()
    latitud = models.FloatField()
    categoria = models.TextField()
    funciones = models.TextField()