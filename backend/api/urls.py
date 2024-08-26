from django.urls import path
from . import views

urlpatterns = [
    # User-related URLs
    path("user/profile/", views.UserProfileView.as_view(), name="user-profile"),
    path("user/profile/update/", views.UpdateUserProfileView.as_view(), name="user-profile-update"),

    # Note-related URLs
    path("notes/", views.NoteListCreate.as_view(), name="note-list-create"),
    path("notes/<slug:slug>/", views.NoteRetrieveUpdateDestroy.as_view(), name="note-detail"),
    path("notes/<slug:slug>/archive/", views.NoteArchive.as_view(), name="note-archive"),
    path("notes/<slug:slug>/pin/", views.NotePin.as_view(), name="note-pin"),

    # Tag-related URLs
    path("tags/", views.TagListCreate.as_view(), name="tag-list-create"),
    path("tags/<slug:slug>/", views.TagRetrieveUpdateDestroy.as_view(), name="tag-detail"),
]