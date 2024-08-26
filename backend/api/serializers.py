from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, UserProfile, Tag, Attachment
import random

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
    tags = TagSerializer(many=True, required=False)
    attachments = AttachmentSerializer(many=True, required=False)
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Note
        fields = [
            "id", "title", "content", "created_at", "updated_at", 
            "author", "tags", "is_archived", "is_pinned", "color", "slug", "attachments"
        ]
        read_only_fields = ['created_at', 'updated_at', 'author', 'slug']

    def create(self, validated_data):
        tags_data = validated_data.pop('tags', [])
        attachments_data = validated_data.pop('attachments', [])
        
        # Automatically assign a color if not provided
        if 'color' not in validated_data:
            validated_data['color'] = random.choice(['#FFB6C1', '#FFD700', '#ADFF2F', '#ADD8E6'])  # Example colors
            
        # Create the note
        note = Note.objects.create(**validated_data)

        # Handle tags
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            note.tags.add(tag)

        # Handle attachments
        for attachment_data in attachments_data:
            Attachment.objects.create(note=note, **attachment_data)

        return note

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        attachments_data = validated_data.pop('attachments', [])
        
        # Update the note instance
        instance = super().update(instance, validated_data)

        # Clear existing tags and add new ones
        instance.tags.clear()
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            instance.tags.add(tag)
        
        # Clear existing attachments and add new ones
        instance.attachments.clear()
        for attachment_data in attachments_data:
            Attachment.objects.create(note=instance, **attachment_data)
        
        return instance

    def update(self, instance, validated_data):
        tags_data = validated_data.pop('tags', [])
        attachments_data = validated_data.pop('attachments', [])
        
        instance = super().update(instance, validated_data)
        instance.tags.clear()
        
        for tag_data in tags_data:
            tag, _ = Tag.objects.get_or_create(**tag_data)
            instance.tags.add(tag)
        
        instance.attachments.clear()
        for attachment_data in attachments_data:
            Attachment.objects.create(note=instance, **attachment_data)
        
        return instance



class NoteListSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        fields = ["id", "title", "summary", "author", "created_at", "updated_at", "tags", "is_archived", "is_pinned", "color", "slug"]
        read_only_fields = ['created_at', 'updated_at', 'author', 'slug']

class NotePinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['is_pinned']
