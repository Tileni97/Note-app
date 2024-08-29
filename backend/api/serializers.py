from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'gender']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "username": {"required": True, "allow_blank": False}
        }

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        try:
            user = User.objects.create_user(**validated_data)
            UserProfile.objects.create(user=user)
            return user
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            raise serializers.ValidationError(str(e))

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'cover_image', 'body', 'created', 'updated']
