from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, UserProfile, Tag, Attachment

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']
        read_only_fields = ['slug']

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ['id', 'file', 'uploaded_at']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_picture', 'date_joined', 'last_login']
        read_only_fields = ['date_joined', 'last_login']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        profile_data = validated_data.pop('profile', None)
        user = User.objects.create_user(**validated_data)
        if profile_data:
            UserProfile.objects.create(user=user, **profile_data)
        return user

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)
    attachments = AttachmentSerializer(many=True, read_only=True)
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "updated_at", "author", "tags", "is_archived", "is_pinned", "color", "slug", "attachments"]
        read_only_fields = ['created_at', 'updated_at', 'author', 'slug']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        note = Note.objects.create(**validated_data)
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            note.tags.add(tag)
        return note

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        instance = super().update(instance, validated_data)
        instance.tags.clear()
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            instance.tags.add(tag)
        return instance

class NoteListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "summary", "author", "created_at", "updated_at", "tags", "is_archived", "is_pinned", "color", "slug"]
        read_only_fields = ['created_at', 'updated_at', 'author', 'slug']