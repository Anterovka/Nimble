# Деплой NimbleCopy на VPS

Пошаговая инструкция по деплою всего проекта на VPS сервер.

## Требования

- VPS с Ubuntu 20.04+ (или другой Linux)
- Минимум 2GB RAM, 20GB диска
- Домен (опционально, но рекомендуется)
- SSH доступ к серверу

## 1. Подготовка VPS

### Подключение к серверу

```bash
ssh root@your-server-ip
```

### Установка Docker и Docker Compose

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Проверка
docker --version
docker-compose --version
```

### Установка Git

```bash
apt install git -y
```

## 2. Клонирование проекта

```bash
# Создаем директорию для проекта
mkdir -p /var/www
cd /var/www

# Клонируем проект (замените на ваш репозиторий)
git clone https://github.com/your-username/NimbleCopy.git
cd NimbleCopy
```

Или загрузите проект через SCP:

```bash
# На локальной машине
scp -r ./NimbleCopy root@your-server-ip:/var/www/
```

## 3. Настройка переменных окружения

### Backend (.env)

```bash
cd /var/www/NimbleCopy/backend
nano .env
```

Содержимое `.env`:

```env
DEBUG=False
SECRET_KEY=your-very-secure-secret-key-change-this-to-random-string
DB_NAME=nimble
DB_USER=nimble_user
DB_PASSWORD=strong-password-here
DB_HOST=db
DB_PORT=3306
CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com,your-server-ip
```

**Важно:** Сгенерируйте безопасный SECRET_KEY:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

### Frontend (.env.local)

```bash
cd /var/www/NimbleCopy/frontend
nano .env.local
```

Содержимое `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
# или если без домена:
# NEXT_PUBLIC_API_URL=http://your-server-ip:8000/api
```

## 4. Настройка docker-compose.yml для production

Отредактируйте `docker-compose.yml`:

```bash
cd /var/www/NimbleCopy
nano docker-compose.yml
```

Измените:

```yaml
services:
  backend:
    environment:
      - DEBUG=False  # Изменить на False
      - SECRET_KEY=${SECRET_KEY}  # Будет браться из .env
      - CORS_ALLOWED_ORIGINS=https://yourdomain.com,http://yourdomain.com
    # Убрать volumes для production (опционально)
    # volumes:
    #   - ./backend:/app  # Убрать эту строку для production
```

## 5. Запуск проекта

```bash
cd /var/www/NimbleCopy

# Сборка образов
docker-compose build

# Запуск в фоне
docker-compose up -d

# Проверка статуса
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

## 6. Настройка Nginx (Reverse Proxy)

### Установка Nginx

```bash
apt install nginx -y
```

### Создание конфигурации

```bash
nano /etc/nginx/sites-available/nimblecopy
```

Содержимое (замените `yourdomain.com` на ваш домен):

```nginx
# Backend (API)
server {
    listen 80;
    server_name api.yourdomain.com;  # или yourdomain.com/api

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

Или один сервер для всего:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend Admin
    location /admin {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Активация конфигурации

```bash
ln -s /etc/nginx/sites-available/nimblecopy /etc/nginx/sites-enabled/
nginx -t  # Проверка конфигурации
systemctl restart nginx
```

## 7. Настройка SSL (Let's Encrypt)

```bash
# Установка Certbot
apt install certbot python3-certbot-nginx -y

# Получение сертификата
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автоматическое обновление
certbot renew --dry-run
```

## 8. Настройка файрвола

```bash
# UFW (если установлен)
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Или iptables
iptables -A INPUT -p tcp --dport 22 -j ACCEPT
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

## 9. Обновление проекта

```bash
cd /var/www/NimbleCopy

# Остановить контейнеры
docker-compose down

# Обновить код
git pull  # или загрузить новую версию

# Пересобрать и запустить
docker-compose build
docker-compose up -d

# Применить миграции (если есть новые)
docker-compose exec backend python manage.py migrate
```

## 10. Полезные команды

```bash
# Просмотр логов
docker-compose logs -f backend
docker-compose logs -f frontend

# Перезапуск сервиса
docker-compose restart backend
docker-compose restart frontend

# Войти в контейнер
docker-compose exec backend sh
docker-compose exec frontend sh

# Создать суперпользователя (если нужно)
docker-compose exec backend python manage.py createsuperuser

# Очистить все и пересоздать
docker-compose down -v
docker-compose up -d --build
```

## 11. Проверка работы

После деплоя проверьте:

1. **Frontend:** `https://yourdomain.com` или `http://your-server-ip:3000`
2. **Backend API:** `https://yourdomain.com/api/` или `http://your-server-ip:8000/api/`
3. **Админка:** `https://yourdomain.com/admin/` или `http://your-server-ip:8000/admin/`

## Troubleshooting

### Проблемы с подключением к БД

```bash
# Проверить статус MySQL
docker-compose ps db
docker-compose logs db

# Пересоздать БД
docker-compose down -v
docker-compose up -d db
# Подождать 30 секунд
docker-compose up -d
```

### Проблемы с портами

Если порты заняты, измените в `docker-compose.yml`:

```yaml
ports:
  - "8001:8000"  # Backend
  - "3001:3000"  # Frontend
```

И обновите Nginx конфигурацию соответственно.

### Проблемы с правами

```bash
chown -R $USER:$USER /var/www/NimbleCopy
chmod -R 755 /var/www/NimbleCopy
```

### Проверка логов

```bash
# Все логи
docker-compose logs

# Конкретный сервис
docker-compose logs backend
docker-compose logs frontend

# Последние 100 строк
docker-compose logs --tail=100 backend
```

## Безопасность

1. ✅ Измените `SECRET_KEY` на случайную строку
2. ✅ Установите `DEBUG=False`
3. ✅ Используйте сильные пароли для БД
4. ✅ Настройте SSL (HTTPS)
5. ✅ Ограничьте доступ к портам через файрвол
6. ✅ Регулярно обновляйте систему и Docker

## Мониторинг

```bash
# Использование ресурсов
docker stats

# Проверка дискового пространства
df -h
docker system df
```

