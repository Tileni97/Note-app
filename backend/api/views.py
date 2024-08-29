from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import (
    UserSerializer, 
    NoteSerializer, 
    UserProfileSerializer
)
from .models import Note
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import api_view
import logging

logger = logging.getLogger(__name__)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def update_profile_picture(self, profile, gender):
        if not profile.profile_picture:
            avatar_urls = {
                "M": "https://avatar.iran.liara.run/public/boy",
                "F": "https://avatar.iran.liara.run/public/girl",
                "O": "https://avatar.iran.liara.run/public"
            }
            profile.profile_picture = avatar_urls.get(gender, "https://avatar.iran.liara.run/public")

    def post(self, request):
        profile = self.get_object()
        data = request.data
        profile.bio = data.get("bio", profile.bio)
        profile.gender = data.get("gender", profile.gender)
        profile_picture = request.FILES.get("profile_picture")

        if profile_picture:
            profile.profile_picture = profile_picture
        else:
            self.update_profile_picture(profile, profile.gender)

        profile.save()
        return Response({"status": "Profile updated successfully."})

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        logger.info("Received data: %s", request.data)
        serializer = self.get_serializer(data=request.data)

        if not serializer.is_valid():
            logger.error("Validation errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.exception("Error during user creation")
            return Response({"detail": "An error occurred during user creation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_notes_list(request):
    notes = Note.objects.all().order_by('-updated')
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_note_detail(request, pk):
    note = get_object_or_404(Note, pk=pk)
    serializer = NoteSerializer(note)
    return Response(serializer.data)

@api_view(['POST'])
def create_note(request):
    serializer = NoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
def update_note(request, pk):
    note = get_object_or_404(Note, pk=pk)
    serializer = NoteSerializer(instance=note, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def delete_note(request, pk):
    note = get_object_or_404(Note, pk=pk)
    note.delete()
    return Response({"detail": "Note was deleted!"}, status=status.HTTP_204_NO_CONTENT)
