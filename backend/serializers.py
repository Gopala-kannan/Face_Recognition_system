from rest_framework import serializers
from django.contrib.auth.models import User
from backend.models import FaceRecognition

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class FaceRecognitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaceRecognition
        fields = ['name', 'image', 'uploaded_at', 'result_image']