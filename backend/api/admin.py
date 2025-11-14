"""
Админ-панель Django
"""
from django.contrib import admin
from django.utils.html import format_html
from .models import Project, Subscription, CustomBlock, VPSServer


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'subscription_type', 'is_active', 'created_at', 'expires_at']
    list_filter = ['subscription_type', 'is_active']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'user',
        'slug',
        'deploy_type_display',
        'deployed_status',
        'is_published',
        'is_public',
        'views_count',
        'created_at',
        'updated_at'
    ]
    list_filter = [
        'is_published',
        'is_public',
        'deploy_type',
        'user',
        'created_at',
        'deployed_at'
    ]
    search_fields = ['title', 'slug', 'description', 'user__username', 'subdomain', 'deployed_url']
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
        ('Деплой', {
            'fields': (
                'deploy_type',
                'deployed_url',
                'deployed_at',
                'subdomain'
            )
        }),
        ('Публикация', {
            'fields': ('is_published', 'is_public', 'published_at')
        }),
        ('Даты', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def deploy_type_display(self, obj):
        """Отображение типа деплоя"""
        if obj.deploy_type == 'builder_vps':
            return format_html('<span style="color: #4CAF50;">VPS сервер конструктора</span>')
        elif obj.deploy_type == 'vps':
            return format_html('<span style="color: #2196F3;">VPS (свой сервер)</span>')
        return format_html('<span style="color: #999;">Не указан</span>')
    deploy_type_display.short_description = 'Тип деплоя'
    
    def deployed_status(self, obj):
        """Отображение статуса деплоя"""
        if obj.deployed_url:
            return format_html(
                '<a href="{}" target="_blank" style="color: green;">✓ Задеплоен</a>',
                obj.deployed_url
            )
        return format_html('<span style="color: #999;">Не задеплоен</span>')
    deployed_status.short_description = 'Статус деплоя'


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


@admin.register(VPSServer)
class VPSServerAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'host',
        'port',
        'username',
        'domain_display',
        'is_active',
        'is_default',
        'status_display',
        'created_at'
    ]
    list_filter = ['is_active', 'is_default', 'ssl_enabled', 'nginx_config_enabled', 'created_at']
    search_fields = ['name', 'host', 'domain', 'username', 'email']
    readonly_fields = ['created_at', 'updated_at', 'password_display']
    actions = ['make_active', 'make_inactive', 'set_as_default', 'unset_as_default']
    fieldsets = (
        ('Основная информация', {
            'fields': ('name', 'host', 'port', 'username', 'password', 'password_display')
        }),
        ('Настройки деплоя', {
            'fields': ('deploy_path', 'domain', 'email')
        }),
        ('Конфигурация', {
            'fields': (
                'is_active',
                'is_default',
                'nginx_config_enabled',
                'ssl_enabled'
            )
        }),
        ('Дополнительно', {
            'fields': ('notes', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def domain_display(self, obj):
        """Отображение домена"""
        if obj.domain:
            return format_html('<span style="color: green;">{}</span>', obj.domain)
        return format_html('<span style="color: #999;">Не указан</span>')
    domain_display.short_description = 'Домен'
    
    def password_display(self, obj):
        """Отображение пароля (скрытый)"""
        if obj.pk:
            return format_html(
                '<span style="font-family: monospace;">{}</span>',
                '*' * min(len(obj.password), 20)
            )
        return 'Пароль будет сохранен после создания'
    password_display.short_description = 'Пароль (текущий)'
    
    def status_display(self, obj):
        """Отображение статуса сервера"""
        if obj.is_active:
            if obj.is_default:
                return format_html(
                    '<span style="color: green; font-weight: bold;">✓ Активен (по умолчанию)</span>'
                )
            return format_html('<span style="color: green;">✓ Активен</span>')
        return format_html('<span style="color: red;">✗ Неактивен</span>')
    status_display.short_description = 'Статус'
    
    def save_model(self, request, obj, form, change):
        """Обработка сохранения"""
        # Если пароль не изменился и это редактирование, сохраняем старый
        if change:
            if 'password' not in form.changed_data or not form.cleaned_data.get('password'):
                # Пароль не был изменен или пустой, сохраняем старый
                try:
                    old_obj = VPSServer.objects.get(pk=obj.pk)
                    obj.password = old_obj.password
                except VPSServer.DoesNotExist:
                    pass
        
        super().save_model(request, obj, form, change)
    
    def get_form(self, request, obj=None, **kwargs):
        """Переопределяем форму для правильной работы с паролем"""
        form = super().get_form(request, obj, **kwargs)
        if obj:  # Если редактируем существующий объект
            # Делаем поле пароля необязательным при редактировании
            form.base_fields['password'].required = False
        return form
    
    @admin.action(description='Активировать выбранные серверы')
    def make_active(self, request, queryset):
        """Активировать выбранные серверы"""
        updated = queryset.update(is_active=True)
        self.message_user(request, f'{updated} сервер(ов) активировано.')
    make_active.short_description = 'Активировать выбранные серверы'
    
    @admin.action(description='Деактивировать выбранные серверы')
    def make_inactive(self, request, queryset):
        """Деактивировать выбранные серверы"""
        updated = queryset.update(is_active=False, is_default=False)
        self.message_user(request, f'{updated} сервер(ов) деактивировано.')
    make_inactive.short_description = 'Деактивировать выбранные серверы'
    
    @admin.action(description='Установить как сервер по умолчанию')
    def set_as_default(self, request, queryset):
        """Установить выбранный сервер как сервер по умолчанию"""
        # Снимаем флаг с других серверов
        VPSServer.objects.filter(is_default=True).update(is_default=False)
        # Устанавливаем для выбранных
        updated = queryset.update(is_default=True, is_active=True)
        self.message_user(
            request,
            f'{updated} сервер(ов) установлено как сервер(ы) по умолчанию.'
        )
    set_as_default.short_description = 'Установить как сервер по умолчанию'
    
    @admin.action(description='Снять флаг сервера по умолчанию')
    def unset_as_default(self, request, queryset):
        """Снять флаг сервера по умолчанию"""
        updated = queryset.update(is_default=False)
        self.message_user(request, f'Флаг "по умолчанию" снят с {updated} сервер(ов).')
    unset_as_default.short_description = 'Снять флаг сервера по умолчанию'

