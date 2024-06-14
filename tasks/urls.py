from django.urls import path, include
from rest_framework import routers
from tasks import views

# Api versioning
router = routers.DefaultRouter()
router.register(r'tasks', views.PointView, basename='task')

urlpatterns = [
    path("api/v1/", include(router.urls)),
    path("api/v1/comuna/", views.ComunaView.as_view(), name='comuna-view'),
    path("api/v1/distance/", views.DistanceView.as_view(), name="distance-view")
]
