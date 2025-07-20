from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class FaceRecognition(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='uploads/')
    result_image = models.ImageField(upload_to='results/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name