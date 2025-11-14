#!/bin/bash
set -e

echo "Ожидание запуска MySQL..."
until python -c "import socket; s = socket.socket(); s.connect(('db', 3306)); s.close()" 2>/dev/null; do
  echo "Ожидание MySQL..."
  sleep 2
done

echo "MySQL запущен!"

echo "Применение миграций..."
python manage.py migrate --noinput

echo "Сбор статики..."
python manage.py collectstatic --noinput || true

echo "Создание суперпользователя (если не существует)..."
python manage.py shell << 'EOF'
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print('Суперпользователь создан: admin/admin')
else:
    print('Суперпользователь уже существует')
EOF

echo "Запуск сервера..."
exec "$@"

