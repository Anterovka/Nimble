"""
Админ-панель Django
"""
from django.contrib import admin
from .models import Project, Subscription, CustomBlock


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'subscription_type', 'is_active', 'created_at', 'expires_at']
    list_filter = ['subscription_type', 'is_active']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'slug', 'is_published', 'is_public', 'views_count', 'created_at', 'updated_at']
    list_filter = ['is_published', 'is_public', 'user', 'created_at']
    search_fields = ['title', 'slug', 'description', 'user__username']
    readonly_fields = ['created_at', 'updated_at', 'published_at', 'views_count']
    fieldsets = (
        ('Основная информация', {
            'fields': ('user', 'title', 'slug', 'description')
        }),
        ('Содержимое', {
            'fields': ('html_content', 'css_content', 'json_content')
        }),
        ('Настройки', {
            'fields': ('header_settings', 'footer_settings')
        }),
        ('Публикация', {
            'fields': ('is_published', 'is_public', 'published_at')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(CustomBlock)
class CustomBlockAdmin(admin.ModelAdmin):
    list_display = ['name', 'block_id', 'category', 'is_active', 'order', 'created_by', 'created_at']
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['name', 'block_id', 'description']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'block_id', 'category', 'description', 'preview')
        }),
        ('Содержимое', {
            'fields': ('content', 'label', 'media')
        }),
        ('Настройки', {
            'fields': ('is_active', 'order', 'attributes', 'traits', 'component_type')
        }),
        ('Аудит', {
            'fields': ('created_by', 'created_at', 'updated_at')
        }),
    )
    
    def save_model(self, request, obj, form, change):
        """Автоматически устанавливаем created_by при создании"""
        if not change:  # Если это новый объект
            obj.created_by = request.user
        super().save_model(request, obj, form, change)

