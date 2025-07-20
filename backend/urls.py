from django.urls import path
from backend import views

urlpatterns = [
    path('', views.get_route),
    path('register/', views.register),
    path('login/', views.login_view),
    path('logout/', views.logout_view),
    path('facerecognition/', views.facerecognition),
    path('uploadhistory/', views.uploadhistory),
]