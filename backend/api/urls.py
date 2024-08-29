from django.urls import path
from . import views

urlpatterns = [
    # User-related URLs
    path("users/profile/", views.UserProfileView.as_view(), name="user-profile"),
    
    # Note-related URLs
    path('notes/', views.get_notes_list, name='notes'),
    path('notes/<int:pk>/', views.get_note_detail, name='note-detail'),
    path('notes/create/', views.create_note, name='create-note'),
    path('notes/update/<int:pk>/', views.update_note, name='update-note'),
    path('notes/delete/<int:pk>/', views.delete_note, name='delete-note'),
]
