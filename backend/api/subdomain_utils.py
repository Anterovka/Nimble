"""
Утилиты для работы с поддоменами и деплоем на сервер конструктора
"""
import os
import zipfile
import tempfile
import re
from pathlib import Path
from typing import Tuple, Optional
from django.conf import settings
from django.core.exceptions import ValidationError


def validate_subdomain(subdomain: str) -> None:
    """Валидация поддомена"""
    if not subdomain:
        raise ValidationError("Поддомен не может быть пустым")
    
    # Проверка длины
    if len(subdomain) < 3:
        raise ValidationError("Поддомен должен содержать минимум 3 символа")
    
    if len(subdomain) > 63:
        raise ValidationError("Поддомен не может быть длиннее 63 символов")
    
    # Проверка формата (только буквы, цифры, дефисы, не может начинаться/заканчиваться дефисом)
    if not re.match(r'^[a-z0-9]([a-z0-9-]*[a-z0-9])?$', subdomain.lower()):
        raise ValidationError(
            "Поддомен может содержать только строчные буквы, цифры и дефисы. "
            "Не может начинаться или заканчиваться дефисом."
        )
    
    # Запрещенные поддомены
    forbidden = ['www', 'api', 'admin', 'static', 'media', 'deploy', 'app', 'mail', 'ftp', 'localhost']
    if subdomain.lower() in forbidden:
        raise ValidationError(f"Поддомен '{subdomain}' зарезервирован и не может быть использован")


def generate_subdomain(project_id: int, user_id: int, title: str) -> str:
    """
    Генерирует уникальный поддомен на основе проекта
    
    Args:
        project_id: ID проекта
        user_id: ID пользователя
        title: Название проекта
    
    Returns:
        Сгенерированный поддомен
    """
    # Создаем базовый поддомен из названия проекта
    base = re.sub(r'[^a-z0-9-]', '', title.lower())[:30]
    base = re.sub(r'-+', '-', base).strip('-')
    
    if not base:
        base = f"project{project_id}"
    
    # Добавляем ID пользователя для уникальности
    subdomain = f"{base}-{user_id}"
    
    # Если все еще слишком длинный, обрезаем
    if len(subdomain) > 50:
        subdomain = subdomain[:50]
    
    # Убираем дефисы в конце
    subdomain = subdomain.rstrip('-')
    
    return subdomain


def get_deploy_path(subdomain: str) -> Path:
    """
    Получает путь для сохранения файлов проекта на сервере
    
    Args:
        subdomain: Поддомен проекта
    
    Returns:
        Path к директории проекта
    """
    deploy_root = Path(settings.DEPLOY_STATIC_ROOT)
    deploy_root.mkdir(parents=True, exist_ok=True)
    
    project_path = deploy_root / subdomain
    project_path.mkdir(parents=True, exist_ok=True)
    
    return project_path


def get_deploy_url(subdomain: str) -> str:
    """
    Генерирует URL для доступа к задеплоенному сайту
    
    Args:
        subdomain: Поддомен проекта
    
    Returns:
        Полный URL сайта
    """
    base_domain = settings.DEPLOY_BASE_DOMAIN
    
    # Определяем базовый URL API
    if 'localhost' in base_domain or '127.0.0.1' in base_domain:
        protocol = 'http'
        if ':' in base_domain:
            host, port = base_domain.split(':')
            base_url = f"{protocol}://{host}:{port}"
        else:
            base_url = f"{protocol}://{base_domain}"
    else:
        protocol = 'https'
        base_url = f"{protocol}://{base_domain}"
    
    # Возвращаем URL через API endpoint
    return f"{base_url}/api/deployed/{subdomain}/"


def extract_and_save_files(
    zip_path: str,
    subdomain: str
) -> Tuple[bool, str]:
    """
    Извлекает файлы из ZIP и сохраняет их на сервере
    
    Args:
        zip_path: Путь к ZIP архиву
        subdomain: Поддомен проекта
    
    Returns:
        Tuple[bool, str]: (успех, сообщение)
    """
    try:
        deploy_path = get_deploy_path(subdomain)
        
        # Очищаем старую директорию (если есть)
        if deploy_path.exists():
            import shutil
            shutil.rmtree(deploy_path)
        deploy_path.mkdir(parents=True, exist_ok=True)
        
        # Извлекаем файлы
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(deploy_path)
        
        # Проверяем наличие index.html
        index_path = deploy_path / 'index.html'
        if not index_path.exists():
            return False, "В архиве отсутствует index.html"
        
        # Проверяем размер файла
        if index_path.stat().st_size == 0:
            return False, "Файл index.html пустой"
        
        # Проверяем наличие styles.css (опционально)
        css_path = deploy_path / 'styles.css'
        if css_path.exists() and css_path.stat().st_size == 0:
            return False, "Файл styles.css пустой"
        
        return True, f"Файлы успешно сохранены в {deploy_path}"
        
    except zipfile.BadZipFile:
        return False, "Некорректный формат ZIP архива"
    except Exception as e:
        return False, f"Ошибка при сохранении файлов: {str(e)}"


def delete_deployed_files(subdomain: str) -> Tuple[bool, str]:
    """
    Удаляет файлы задеплоенного проекта
    
    Args:
        subdomain: Поддомен проекта
    
    Returns:
        Tuple[bool, str]: (успех, сообщение)
    """
    try:
        deploy_path = get_deploy_path(subdomain)
        
        if deploy_path.exists():
            import shutil
            shutil.rmtree(deploy_path)
            return True, f"Файлы проекта {subdomain} успешно удалены"
        else:
            return True, f"Директория проекта {subdomain} не найдена"
            
    except Exception as e:
        return False, f"Ошибка при удалении файлов: {str(e)}"

