from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import generics, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import UserSerializer, NoteSerializer, UserProfileSerializer, NoteListSerializer, TagSerializer, NotePinSerializer
from .models import Note, Tag, UserProfile
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
import logging

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print("Received data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        logger.info("Received data: %s", request.data)
        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            logger.error("Validation errors: %s", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            return super().create(request, *args, **kwargs)
        except Exception as e:
            logger.exception("Error during user creation")
            return Response({"detail": "An error occurred during user creation."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpdateUserProfileView(generics.UpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

    def perform_update(self, serializer):
        serializer.save()

class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['tags__name', 'is_archived', 'is_pinned']
    search_fields = ['title', 'content']
    ordering_fields = ['created_at', 'updated_at', 'title']

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return NoteListSerializer
        return NoteSerializer

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        files = request.FILES.getlist('attachments')
        
        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        note = serializer.save(author=self.request.user)
        
        for file in files:
            Attachment.objects.create(note=note, file=file)
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class NoteRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    lookup_field = 'slug'
    queryset = Note.objects.all()  # Add this line to specify the queryset

    def put(self, request, *args, **kwargs):
        note = self.get_object()
        serializer = self.get_serializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NoteArchive(generics.UpdateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def perform_update(self, serializer):
        instance = serializer.save(is_archived=not serializer.instance.is_archived)
        return instance

    def put(self, request, *args, **kwargs):
        note = self.get_object()
        note.is_archived = not note.is_archived
        note.save()
        serializer = self.get_serializer(note)
        return Response({
            'status': 'success',
            'is_archived': note.is_archived
        }, status=status.HTTP_200_OK)

class NotePin(generics.UpdateAPIView):
    serializer_class = NotePinSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    def put(self, request, *args, **kwargs):
        note = self.get_object()
        note.is_pinned = not note.is_pinned
        note.save()
        serializer = self.get_serializer(note)
        return Response({
            'status': 'success',
            'is_pinned': note.is_pinned
        }, status=status.HTTP_200_OK)

class TagListCreate(generics.ListCreateAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    queryset = Tag.objects.all()

class TagRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
    queryset = Tag.objects.all()

@api_view(['GET'])
def note_stats(request):
    total_notes = Note.objects.filter(author=request.user).count()
    archived_notes = Note.objects.filter(author=request.user, is_archived=True).count()
    pinned_notes = Note.objects.filter(author=request.user, is_pinned=True).count()

    return Response({
        'total': total_notes,
        'archived': archived_notes,
        'pinned': pinned_notes
    })