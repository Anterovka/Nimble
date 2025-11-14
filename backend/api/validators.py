"""
Кастомные валидаторы для API
"""
from django.core.exceptions import ValidationError
import re


def validate_password_custom(password):
    """
    Валидация пароля:
    - Минимум 8 символов
    - Обязательно буквы (латиница или кириллица)
    - Обязательно цифры
    """
    errors = []
    
    # Проверка минимальной длины
    if len(password) < 8:
        errors.append("Пароль должен содержать минимум 8 символов")
    
    # Проверка наличия букв (латиница или кириллица)
    if not re.search(r'[a-zA-Zа-яА-Я]', password):
        errors.append("Пароль должен содержать буквы")
    
    # Проверка наличия цифр
    if not re.search(r'[0-9]', password):
        errors.append("Пароль должен содержать цифры")
    
    if errors:
        raise ValidationError(errors)
    
    return password


class CustomPasswordValidator:
    """
    Класс-валидатор пароля для Django settings:
    - Минимум 8 символов
    - Обязательно буквы (латиница или кириллица)
    - Обязательно цифры
    """
    
    def validate(self, password, user=None):
        validate_password_custom(password)
    
    def get_help_text(self):
        return "Пароль должен содержать минимум 8 символов, буквы и цифры"


def validate_username_english(username):
    """
    Валидация имени пользователя:
    - Только английские буквы, цифры, дефисы и подчеркивания
    """
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        raise ValidationError("Имя пользователя может содержать только английские буквы, цифры, дефисы и подчеркивания")
    return username

