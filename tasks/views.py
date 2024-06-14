from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from .serializer import PointSerializer
from .models import Point
from math import radians, sin, cos, sqrt, atan2
from django.http import HttpResponse
from django.views import View

# Create your views here.
class PointView(viewsets.ModelViewSet):
    serializer_class = PointSerializer
    queryset = Point.objects.all()

class ComunaView(APIView):
    def get(self, request):
        comuna_get = request.query_params.get('comuna', None)
        
        if comuna_get is None:
            return Response({'error': 'Missing comuna parameter'}, status=400)
        
        puntos = Point.objects.filter(comuna=comuna_get)
        serializer = PointSerializer(puntos, many=True)
        return Response(serializer.data)
    
class DistanceView(APIView):
    # Función para calcular la distancia entre dos puntos usando la fórmula haversine
    def haversine(self, lat1, lon1, lat2, lon2):
        # Convertir latitud y longitud de grados a radianes
        lat1_rad = radians(lat1)
        lon1_rad = radians(lon1)
        lat2_rad = radians(lat2)
        lon2_rad = radians(lon2)
        
        # Radio de la Tierra en metros
        R = 6371000  # Radio promedio de la Tierra en metros
        
        # Diferencia de latitud y longitud
        dlat = lat2_rad - lat1_rad
        dlon = lon2_rad - lon1_rad
        
        # Aplicar la fórmula haversine
        a = sin(dlat / 2)**2 + cos(lat1_rad) * cos(lat2_rad) * sin(dlon / 2)**2
        c = 2 * atan2(sqrt(a), sqrt(1 - a))
        distance = R * c
        
        return distance

    def get(self, request):
        # Obtener parámetros de consulta (lat, lon, distancia máxima en metros)
        lat = float(request.query_params.get('lat', 0))
        lon = float(request.query_params.get('lon', 0))
        max_distance = float(request.query_params.get('m', 1000))  # Default: 1000 metros
        
        # Filtrar ubicaciones que están dentro de la distancia máxima
        ubicaciones_cercanas = []
        for ubicacion in Point.objects.all():
            distance = self.haversine(lat, lon, ubicacion.latitud, ubicacion.longitud)
            if distance <= max_distance:
                ubicaciones_cercanas.append(ubicacion)
        
        # Puedes serializar las ubicaciones si es necesario antes de enviar la respuesta
        # Ejemplo de serialización si tienes un serializador definido para Ubicacion
        
        # from .serializers import UbicacionSerializer
        # serializer = UbicacionSerializer(ubicaciones_cercanas, many=True)
        
        # Devolver respuesta con las ubicaciones encontradas
        serializer = PointSerializer(ubicaciones_cercanas, many=True)
        return Response(serializer.data)
    
class Main(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse("Hello, World!")