"""
Модели для хранения проектов
"""
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError


class Subscription(models.Model):
    """Модель подписки пользователя"""
    SUBSCRIPTION_TYPES = [
        ('free', 'Бесплатная'),
        ('premium', 'Премиум'),
    ]
    
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='subscription',
        verbose_name="Пользователь"
    )
    subscription_type = models.CharField(
        max_length=20,
        choices=SUBSCRIPTION_TYPES,
        default='free',
        verbose_name="Тип подписки"
    )
    is_active = models.BooleanField(default=True, verbose_name="Активна")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создана")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлена")
    expires_at = models.DateTimeField(null=True, blank=True, verbose_name="Истекает")
    
    class Meta:
        verbose_name = "Подписка"
        verbose_name_plural = "Подписки"
    
    def __str__(self):
        return f"{self.user.username} - {self.get_subscription_type_display()}"
    
    def get_project_limit(self):
        """Возвращает лимит проектов для текущей подписки"""
        if self.subscription_type == 'premium' and self.is_active:
            return None  # Неограниченно
        return 3  # Бесплатная подписка - 3 проекта
    
    def can_create_project(self, current_count):
        """Проверяет, может ли пользователь создать новый проект"""
        limit = self.get_project_limit()
        if limit is None:
            return True
        return current_count < limit


class Project(models.Model):
    """Модель проекта (сайта)"""
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='projects',
        verbose_name="Пользователь"
    )
    title = models.CharField(max_length=255, verbose_name="Название проекта")
    slug = models.SlugField(max_length=255, verbose_name="URL-адрес")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    html_content = models.TextField(blank=True, verbose_name="HTML содержимое")
    css_content = models.TextField(blank=True, verbose_name="CSS содержимое")
    json_content = models.JSONField(default=dict, blank=True, verbose_name="JSON данные GrapesJS")
    
    # Настройки Header/Footer
    header_settings = models.JSONField(default=dict, blank=True, verbose_name="Настройки Header")
    footer_settings = models.JSONField(default=dict, blank=True, verbose_name="Настройки Footer")
    
    # Метаданные
    is_published = models.BooleanField(default=False, verbose_name="Опубликован")
    is_public = models.BooleanField(default=True, verbose_name="Публичный доступ")
    views_count = models.IntegerField(default=0, verbose_name="Количество просмотров")
    
    # Деплой
    deployed_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="URL деплоя")
    deployed_at = models.DateTimeField(null=True, blank=True, verbose_name="Задеплоен")
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлен")
    published_at = models.DateTimeField(null=True, blank=True, verbose_name="Опубликован")
    
    class Meta:
        verbose_name = "Проект"
        verbose_name_plural = "Проекты"
        ordering = ['-updated_at']
        unique_together = [['user', 'slug']]
        indexes = [
            models.Index(fields=['user', 'slug']),
            models.Index(fields=['slug', 'is_published']),
            models.Index(fields=['is_published']),
        ]
    
    def __str__(self) -> str:
        return self.title
    
    def save(self, *args, **kwargs):
        if self.is_published and not self.published_at:
            self.published_at = timezone.now()
        elif not self.is_published:
            self.published_at = None
        super().save(*args, **kwargs)


class CustomBlock(models.Model):
    """Модель кастомного блока для редактора"""
    CATEGORIES = [
        ('Базовые', 'Базовые'),
        ('Структура', 'Структура'),
        ('Формы', 'Формы'),
        ('Медиа', 'Медиа'),
        ('Навигация', 'Навигация'),
        ('Другое', 'Другое'),
    ]
    
    # Основная информация
    name = models.CharField(max_length=255, verbose_name="Название блока")
    block_id = models.SlugField(max_length=255, unique=True, verbose_name="ID блока")
    category = models.CharField(max_length=50, choices=CATEGORIES, default='Другое', verbose_name="Категория")
    description = models.TextField(blank=True, null=True, verbose_name="Описание")
    preview = models.CharField(max_length=10, blank=True, null=True, verbose_name="Превью (эмодзи)")
    
    # Содержимое блока
    content = models.TextField(verbose_name="HTML содержимое")
    label = models.TextField(blank=True, null=True, verbose_name="Label с превью (HTML)")
    
    # Метаданные
    media = models.TextField(blank=True, null=True, verbose_name="SVG иконка")
    is_active = models.BooleanField(default=True, verbose_name="Активен")
    order = models.IntegerField(default=0, verbose_name="Порядок сортировки")
    
    # Дополнительные настройки (JSON для гибкости)
    attributes = models.JSONField(default=dict, blank=True, verbose_name="Дополнительные атрибуты")
    traits = models.JSONField(default=list, blank=True, verbose_name="Traits для редактирования")
    component_type = models.CharField(max_length=100, blank=True, null=True, verbose_name="Тип компонента GrapesJS")
    
    # Аудит
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_blocks',
        verbose_name="Создал"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Обновлен")
    
    class Meta:
        verbose_name = "Кастомный блок"
        verbose_name_plural = "Кастомные блоки"
        ordering = ['category', 'order', 'name']
        indexes = [
            models.Index(fields=['block_id', 'is_active']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self) -> str:
        return f"{self.name} ({self.block_id})"
    
    def clean(self):
        """Валидация данных блока"""
        if not self.block_id:
            raise ValidationError("ID блока обязателен")
        if not self.content:
            raise ValidationError("Содержимое блока обязательно")

