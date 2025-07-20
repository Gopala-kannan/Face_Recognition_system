from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from .serializers import UserRegisterSerializer
from backend.serializers import FaceRecognitionSerializer
from backend.models import FaceRecognition
import face_recognition 
import os
import uuid
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image, ImageDraw
from django.conf import settings


@api_view(['GET'])
def get_route(request):
    return Response([
        '/api/register/',
        '/api/login/',
        '/api/logout/',
        '/api/facerecognition/',
        '/api/uploadhistory/',
    ])

@api_view(['POST'])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Registration successful'}, status=201)
    return Response({'message': 'Bad Request', 'errors': serializer.errors}, status=400)

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return Response({'message': 'Login successful'}, status=200)
    else:
        return Response({'message': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=200)
    return Response({'message': 'User not logged in'}, status=400)


@api_view(['POST'])
def facerecognition(request):
    serializer = FaceRecognitionSerializer(data=request.data)
    if serializer.is_valid():
        name = serializer.validated_data.get('name')
        image_file = serializer.validated_data['image']

        image_name = f"{uuid.uuid4().hex}_{image_file.name}"
        upload_path = f"faces/{image_name}"
        saved_path = default_storage.save(upload_path, ContentFile(image_file.read()))
        image_full_path = os.path.join(settings.MEDIA_ROOT, saved_path)

        image = face_recognition.load_image_file(image_full_path)
        face_locations = face_recognition.face_locations(image)

        pil_image = Image.fromarray(image)
        draw = ImageDraw.Draw(pil_image)

        for (top, right, bottom, left) in face_locations:
            draw.rectangle([left, top, right, bottom], outline="red", width=5)

        result_filename = f"result_{image_name}"
        result_rel_path = f"results/{result_filename}"
        result_abs_path = os.path.join(settings.MEDIA_ROOT, result_rel_path)
        os.makedirs(os.path.dirname(result_abs_path), exist_ok=True)
        pil_image.save(result_abs_path)
        
        instance = FaceRecognition.objects.create(
            name=name,
            image=saved_path, 
            result_image=result_rel_path
        )

        return Response({
            'name': instance.name,
            'face_locations': face_locations,
            'image_url': f"/media/{instance.image}",
            'result_image': f"/media/{instance.result_image}",
            'message': 'Face recognition successful',
        }, status=200)

    return Response({'message': 'Bad Request', 'errors': serializer.errors}, status=400)

@api_view(['GET'])
def uploadhistory(request):
    uploads = FaceRecognition.objects.order_by('uploaded_at')
    serializer = FaceRecognitionSerializer(uploads, many=True)
    return Response(serializer.data)
