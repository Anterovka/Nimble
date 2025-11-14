Django REST API для конструктора одностраничных сайтов.

## Быстрый старт

### Локально

```bash
# Установка зависимостей
pip install -r requirements.txt

# Настройка .env
cp env.example .env

# Миграции
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск
python manage.py runserver
```

### Docker

```bash
docker-compose up
```

При первом запуске автоматически:
- Устанавливаются зависимости
- Применяются миграции
- Создается суперпользователь `admin/admin`
- Запускается gunicorn

## API Endpoints

**Базовый URL:** `http://localhost:8000/api/`

### Аутентификация
- `POST /auth/register/` - Регистрация
- `POST /auth/login/` - Вход (JWT токены)
- `POST /auth/token/refresh/` - Обновление токена
- `GET /auth/profile/` - Профиль
- `GET /auth/my-projects/` - Мои проекты
- `GET /auth/subscription/` - Подписка

### Проекты
**CRUD:** `GET|POST|PUT|PATCH|DELETE /projects/`
- `POST /projects/{id}/publish/` - Публикация
- `POST /projects/{id}/duplicate/` - Дублирование
- `GET /projects/{id}/export/` - Экспорт (HTML/JSON)
- `GET /projects/published/` - Галерея
- `GET /projects/public/{slug}/` - Публичный просмотр

### Блоки (только суперпользователи)
**CRUD:** `GET|POST|PUT|PATCH|DELETE /blocks/`
- Фильтры: `?category=Базовые&is_active=true`

### Деплой
- `POST /deploy/` - Деплой на VPS через SSH

## Модели

### Project
- `user`, `title`, `slug` (уникален в рамках пользователя)
- `html_content`, `css_content`, `json_content`
- `header_settings`, `footer_settings`
- `is_published`, `is_public`, `views_count`
- `deployed_url`, `deployed_at`

### CustomBlock
- `name`, `block_id`, `category`
- `content` (HTML), `label` (HTML превью)
- `attributes` (JSON), `traits` (JSON)
- `is_active`, `order`

### Subscription
- `user`, `subscription_type` (free/premium)
- `is_active`, `expires_at`

## Архитектура

### Система блоков

**Встроенные** - в коде `frontend/app/utils/editor/blocks.ts`, регистрируются через `registerBlocks(editor)`

**Кастомные** - в БД (`CustomBlock`), загружаются динамически:
```
initEditor() → loadCustomBlocks() → GET /api/blocks/ → 
→ для каждого: GET /api/blocks/{id}/ → BlockManager.add() → BlockManager.render()
```

**Добавление:**
- Через админку `/admin/blocks/` (суперпользователи)
- Программно: `CustomBlock.objects.create(...)`
- Блоки появляются без перезапуска

**Гибкость:**
- Расширяемость через БД без изменения кода
- Настраиваемость: `attributes` (JSON), `traits` (JSON), `component_type`
- Визуальное превью через `label` (HTML)
- Включение/выключение через `is_active`
- Полная интеграция с GrapesJS (Style Manager, Traits, resize, drag&drop)

### API

DRF + JWT. `DefaultRouter` для CRUD, `@action` для кастомных действий.

**Права:** `AllowAny` (регистрация, публичные проекты), `IsAuthenticated` (CRUD), суперпользователи (блоки, админка)

**Сериализаторы:** `ProjectListSerializer`, `ProjectSerializer`, `ProjectCreateSerializer`, `CustomBlockSerializer`

**Валидация:** уникальность slug, лимиты подписки, валидация деплоя

### Деплой

ZIP → распаковка → SSH → загрузка файлов → Nginx/SSL (опционально) → возврат URL

Безопасность: валидация host/credentials, таймауты, проверка размеров

## Админ-панель

`http://localhost:8000/admin/` (логин: `admin`, пароль: `admin` в Docker)

## Структура

```
backend/
├── manage.py
├── requirements.txt
├── Dockerfile
├── docker-entrypoint.sh
├── tildarus_backend/
│   ├── settings.py
│   └── urls.py
└── api/
    ├── models.py
    ├── views.py
    ├── serializers.py
    └── urls.py
```

