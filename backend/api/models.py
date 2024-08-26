from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from slugify import slugify
import random
import string

def generate_unique_slug(instance, new_slug=None):
    slug = new_slug or slugify(instance.title)
    Klass = instance.__class__
    qs_exists = Klass.objects.filter(slug=slug).exists()
    if qs_exists:
        random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=4))
        slug = f"{slug}-{random_string}"
        return generate_unique_slug(instance, new_slug=slug)
    return slug

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)
    last_login = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, related_name='notes', blank=True)
    is_archived = models.BooleanField(default=False)
    is_pinned = models.BooleanField(default=False)
    color = models.CharField(max_length=7, default="#FFFFFF")  # Hex color code
    slug = models.SlugField(max_length=200, unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = generate_unique_slug(self)  # Use the unique slug generation function
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

    def summary(self):
        return self.content[:100] + '...' if len(self.content) > 100 else self.content

    class Meta:
        ordering = ['-is_pinned', '-created_at']
        verbose_name = 'Note'
        verbose_name_plural = 'Notes'

class Attachment(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='note_attachments/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Attachment for {self.note.title}"
