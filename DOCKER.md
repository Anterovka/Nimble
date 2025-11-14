# Docker Setup для NimbleCopy

Этот проект использует Docker для запуска frontend (Next.js) и backend (Django) вместе с базой данных MySQL.

## Структура

- `docker-compose.yml` - Production конфигурация
- `docker-compose.dev.yml` - Development конфигурация
- `backend/Dockerfile` - Dockerfile для Django backend
- `frontend/Dockerfile` - Dockerfile для Next.js frontend (production)
- `frontend/Dockerfile.dev` - Dockerfile для Next.js frontend (development)

## Быстрый старт

### Production режим

```bash
# Запустить все сервисы
docker-compose up -d

# Остановить все сервисы
docker-compose down

# Просмотр логов
docker-compose logs -f

# Пересобрать образы
docker-compose build --no-cache
```

### Development режим

```bash
# Запустить все сервисы в dev режиме
docker-compose -f docker-compose.dev.yml up -d

# Остановить
docker-compose -f docker-compose.dev.yml down

# Просмотр логов
docker-compose -f docker-compose.dev.yml logs -f
```

## Сервисы

### Backend (Django)
- **Порт**: 8000
- **URL**: http://localhost:8000
- **API**: http://localhost:8000/api
- **Админка**: http://localhost:8000/admin

### Frontend (Next.js)
- **Порт**: 3000
- **URL**: http://localhost:3000

### База данных (MySQL)
- **Порт**: 3306
- **База данных**: nimble
- **Пользователь**: nimble_user
- **Пароль**: nimble_password

## Переменные окружения

### Backend

Создайте файл `.env` в директории `backend/`:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=nimble
DB_USER=nimble_user
DB_PASSWORD=nimble_password
DB_HOST=db
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
```

### Frontend

Создайте файл `.env.local` в директории `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Первоначальная настройка

После первого запуска нужно выполнить миграции:

```bash
# Выполнить миграции
docker-compose exec backend python manage.py migrate

# Создать суперпользователя
docker-compose exec backend python manage.py createsuperuser

# Собрать статику
docker-compose exec backend python manage.py collectstatic --noinput
```

## Полезные команды

```bash
# Войти в контейнер backend
docker-compose exec backend sh

# Войти в контейнер frontend
docker-compose exec frontend sh

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f frontend

# Остановить и удалить все (включая volumes)
docker-compose down -v

# Пересобрать только один сервис
docker-compose build backend
docker-compose build frontend
```

## Troubleshooting

### Проблемы с базой данных

Если база данных не запускается:

```bash
# Проверить статус
docker-compose ps

# Пересоздать базу данных
docker-compose down -v
docker-compose up -d db
```

### Проблемы с портами

Если порты заняты, измените их в `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Backend на другом порту
  - "3001:3000"  # Frontend на другом порту
```

### Проблемы с правами доступа

```bash
# Исправить права на файлы
sudo chown -R $USER:$USER backend/
sudo chown -R $USER:$USER frontend/
```

## Production Deployment

Для production рекомендуется:

1. Изменить `SECRET_KEY` на безопасный
2. Установить `DEBUG=False`
3. Настроить правильные `ALLOWED_HOSTS`
4. Использовать внешнюю базу данных
5. Настроить SSL/TLS
6. Использовать reverse proxy (nginx)

