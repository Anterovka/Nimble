"""
API Views для проектов
"""
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse, FileResponse, Http404
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from pathlib import Path
from .models import Project, Subscription, CustomBlock
from .serializers import (
    ProjectSerializer,
    ProjectListSerializer,
    ProjectCreateSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    SubscriptionSerializer,
    DeploySerializer,
    CustomBlockSerializer,
    CustomBlockListSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления проектами
    """
    queryset = Project.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'list':
            return ProjectListSerializer
        elif self.action == 'create':
            return ProjectCreateSerializer
        return ProjectSerializer
    
    def get_queryset(self):
        """Фильтрация проектов по пользователю"""
        queryset = super().get_queryset()
        
        if self.request.user.is_authenticated:
            if self.action == 'list':
                queryset = queryset.filter(user=self.request.user)
        else:
            queryset = queryset.filter(is_published=True, is_public=True)
        
        is_public = self.request.query_params.get('is_public', None)
        if is_public is not None:
            queryset = queryset.filter(is_public=is_public.lower() == 'true')
        
        is_published = self.request.query_params.get('is_published', None)
        if is_published is not None:
            queryset = queryset.filter(is_published=is_published.lower() == 'true')
        
        return queryset
    
    def get_object(self):
        """Получение объекта с проверкой прав доступа"""
        obj = super().get_object()
        
        if self.request.user.is_authenticated and obj.user == self.request.user:
            return obj
        
        if not self.request.user.is_authenticated:
            if obj.is_published and obj.is_public:
                return obj
            from rest_framework.exceptions import NotFound
            raise NotFound("Проект не найден или недоступен")
        
        if obj.is_published and obj.is_public:
            return obj
        
        from rest_framework.exceptions import PermissionDenied
        raise PermissionDenied("У вас нет доступа к этому проекту")
    
    def perform_create(self, serializer):
        """Создание проекта с проверкой прав и лимита подписки"""
        if not self.request.user.is_authenticated:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Требуется авторизация")
        
        slug = serializer.validated_data.get('slug')
        if slug and Project.objects.filter(user=self.request.user, slug=slug).exists():
            from rest_framework.exceptions import ValidationError
            raise ValidationError({
                'slug': f'Проект с URL-адресом "{slug}" уже существует. Пожалуйста, выберите другой URL-адрес.'
            })
        
        subscription, created = Subscription.objects.get_or_create(
            user=self.request.user,
            defaults={'subscription_type': 'free', 'is_active': True}
        )
        
        current_project_count = Project.objects.filter(user=self.request.user).count()
        
        if not subscription.can_create_project(current_project_count):
            limit = subscription.get_project_limit()
            from rest_framework.exceptions import ValidationError
            raise ValidationError(
                f"Достигнут лимит проектов для бесплатной подписки ({limit} проекта). "
                "Перейдите на премиум подписку для создания неограниченного количества проектов."
            )
        
        try:
            serializer.save(user=self.request.user)
        except Exception as e:
            from django.db import IntegrityError
            if isinstance(e, IntegrityError):
                from rest_framework.exceptions import ValidationError
                raise ValidationError({
                    'slug': f'Проект с URL-адресом "{slug}" уже существует. Пожалуйста, выберите другой URL-адрес.'
                })
            raise
    
    def get_permissions(self):
        """Права доступа в зависимости от действия"""
        if self.action in ['list', 'retrieve', 'preview', 'export', 'by_slug', 'public_view', 'published_list']:
            # Просмотр доступен всем
            return [AllowAny()]
        elif self.action in ['create', 'update', 'partial_update', 'destroy', 'publish', 'unpublish', 'duplicate']:
            # Изменение требует авторизации
            return [IsAuthenticated()]
        return super().get_permissions()
    
    @action(detail=True, methods=['get'], url_path='preview')
    def preview(self, request, pk=None):
        """
        Получить HTML для предпросмотра проекта
        """
        project = self.get_object()
        
        html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project.title}</title>
    <style>
        {project.css_content}
    </style>
</head>
<body>
    {project.html_content}
</body>
</html>"""
        
        return HttpResponse(html, content_type='text/html; charset=utf-8')
    
    @action(detail=True, methods=['get'], url_path='export')
    def export(self, request, pk=None):
        """
        Экспорт проекта в HTML или JSON файл
        Параметры: ?format=html или ?format=json
        """
        project = self.get_object()
        format_type = request.query_params.get('format', 'html')
        
        if format_type == 'json':
            data = {
                'title': project.title,
                'slug': project.slug,
                'description': project.description,
                'html_content': project.html_content,
                'css_content': project.css_content,
                'json_content': project.json_content,
                'header_settings': project.header_settings,
                'footer_settings': project.footer_settings,
                'created_at': project.created_at.isoformat(),
                'updated_at': project.updated_at.isoformat(),
            }
            response = JsonResponse(data, json_dumps_params={'ensure_ascii': False, 'indent': 2})
            response['Content-Disposition'] = f'attachment; filename="{project.slug}.json"'
            return response
        else:
            html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{project.title}</title>
    <style>
        {project.css_content}
    </style>
</head>
<body>
    {project.html_content}
</body>
</html>"""
            
            response = HttpResponse(html, content_type='text/html; charset=utf-8')
            response['Content-Disposition'] = f'attachment; filename="{project.slug}.html"'
            return response
    
    @action(detail=False, methods=['get'], url_path='by-slug/(?P<slug>[^/.]+)', permission_classes=[AllowAny])
    def by_slug(self, request, slug=None):
        """
        Получить проект по slug (только опубликованные публичные)
        """
        project = get_object_or_404(
            Project,
            slug=slug,
            is_published=True,
            is_public=True
        )
        serializer = self.get_serializer(project)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='public/(?P<slug>[^/.]+)', permission_classes=[AllowAny])
    def public_view(self, request, slug=None):
        """
        Публичный просмотр опубликованного проекта (HTML страница)
        """
        project = get_object_or_404(
            Project,
            slug=slug,
            is_published=True,
            is_public=True
        )
        
        # Увеличиваем счетчик просмотров
        project.views_count += 1
        project.save(update_fields=['views_count'])
        
        html = f"""<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="{project.description or project.title}">
    <title>{project.title}</title>
    <style>
        {project.css_content}
    </style>
</head>
<body>
    {project.html_content}
</body>
</html>"""
        
        return HttpResponse(html, content_type='text/html; charset=utf-8')
    
    @action(detail=True, methods=['post'], url_path='publish', permission_classes=[IsAuthenticated])
    def publish(self, request, pk=None):
        """
        Опубликовать проект (только владелец)
        """
        project = self.get_object()
        if project.user != request.user:
            return Response(
                {"detail": "У вас нет прав для публикации этого проекта"},
                status=status.HTTP_403_FORBIDDEN
            )
        project.is_published = True
        project.save()
        serializer = self.get_serializer(project)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='unpublish', permission_classes=[IsAuthenticated])
    def unpublish(self, request, pk=None):
        """
        Снять проект с публикации (только владелец)
        """
        project = self.get_object()
        if project.user != request.user:
            return Response(
                {"detail": "У вас нет прав для снятия с публикации этого проекта"},
                status=status.HTTP_403_FORBIDDEN
            )
        project.is_published = False
        project.save()
        serializer = self.get_serializer(project)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='duplicate', permission_classes=[IsAuthenticated])
    def duplicate(self, request, pk=None):
        """
        Дублировать проект (создать копию)
        """
        original_project = self.get_object()
        if original_project.user != request.user:
            return Response(
                {"detail": "У вас нет прав для дублирования этого проекта"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Создаем копию проекта
        new_slug = f"{original_project.slug}-copy"
        counter = 1
        while Project.objects.filter(user=request.user, slug=new_slug).exists():
            new_slug = f"{original_project.slug}-copy-{counter}"
            counter += 1
        
        new_project = Project.objects.create(
            user=request.user,
            title=f"{original_project.title} (копия)",
            slug=new_slug,
            description=original_project.description,
            html_content=original_project.html_content,
            css_content=original_project.css_content,
            json_content=original_project.json_content,
            header_settings=original_project.header_settings,
            footer_settings=original_project.footer_settings,
            is_published=False,
            is_public=original_project.is_public,
        )
        
        serializer = self.get_serializer(new_project)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], url_path='published', permission_classes=[AllowAny])
    def published_list(self, request):
        """
        Список всех опубликованных публичных проектов (галерея)
        """
        projects = Project.objects.filter(is_published=True, is_public=True).order_by('-published_at', '-created_at')
        
        # Пагинация
        page = self.paginate_queryset(projects)
        if page is not None:
            serializer = ProjectListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = ProjectListSerializer(projects, many=True)
        return Response(serializer.data)


# Views для авторизации
class RegisterView(generics.CreateAPIView):
    """Регистрация нового пользователя"""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Генерация JWT токенов
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Профиль пользователя"""
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_projects(request):
    """Получить все проекты текущего пользователя"""
    projects = Project.objects.filter(user=request.user)
    serializer = ProjectListSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def subscription_view(request):
    """Получить или обновить подписку пользователя"""
    subscription, created = Subscription.objects.get_or_create(
        user=request.user,
        defaults={'subscription_type': 'free', 'is_active': True}
    )
    
    if request.method == 'GET':
        serializer = SubscriptionSerializer(subscription)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Обновление подписки (для админов или будущей интеграции с платежами)
        subscription_type = request.data.get('subscription_type')
        if subscription_type in ['free', 'premium']:
            subscription.subscription_type = subscription_type
            subscription.is_active = True
            subscription.save()
            serializer = SubscriptionSerializer(subscription)
            return Response(serializer.data)
        return Response({'error': 'Неверный тип подписки'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deploy_view(request):
    """
    Деплой сайта на VPS (свой сервер или сервер конструктора)
    
    Принимает:
    - deploy_type: 'vps' или 'builder_vps'
    - site_zip: ZIP архив с index.html
    - Для VPS (свой сервер): host, port, username, password, deploy_path, domain, email, nginx_config, enable_ssl
    - Для builder_vps: параметры берутся из настроек VPS сервера в админке
    - project_id: ID проекта (опционально)
    
    Возвращает:
    - success: bool
    - message: str
    - url: str (если успешно)
    """
    import os
    import tempfile
    
    # DRF автоматически обрабатывает multipart/form-data
    # request.data уже содержит и обычные поля, и файлы
    serializer = DeploySerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(
            {'error': 'Ошибка валидации', 'details': serializer.errors},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    validated_data = serializer.validated_data
    deploy_type = validated_data.get('deploy_type', 'vps')
    
    temp_files = []
    ssh_client = None
    
    try:
        zip_file = validated_data['site_zip']
        temp_zip = tempfile.NamedTemporaryFile(delete=False, suffix='.zip')
        temp_files.append(temp_zip.name)
        
        for chunk in zip_file.chunks():
            temp_zip.write(chunk)
        temp_zip.close()
        
        project_id = validated_data.get('project_id')
        project = None
        if project_id:
            try:
                project = Project.objects.get(id=project_id, user=request.user)
            except Project.DoesNotExist:
                pass
        
        elif deploy_type == 'builder_vps':
            # Деплой на VPS сервер конструктора (настройки из админки)
            from .models import VPSServer
            from .deploy_utils import (
                create_ssh_client,
                deploy_files,
                deploy_nginx_config,
                obtain_ssl_certificate
            )
            
            # Получаем VPS сервер (по умолчанию или первый активный)
            vps_server = VPSServer.objects.filter(is_active=True).order_by('-is_default', 'id').first()
            
            if not vps_server:
                return Response(
                    {'success': False, 'message': 'Не найден активный VPS сервер в настройках. Настройте сервер в админ-панели.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Генерируем путь для деплоя на основе проекта
            if project:
                deploy_path = f"{vps_server.deploy_path}/{project.slug or f'project-{project.id}'}"
            else:
                deploy_path = f"{vps_server.deploy_path}/project-{request.user.id}-{int(timezone.now().timestamp())}"
            
            # Подключаемся к серверу
            ssh_client = create_ssh_client(
                host=vps_server.host,
                port=vps_server.port,
                username=vps_server.username,
                password=vps_server.password,
                timeout=10
            )
            
            # Деплоим файлы
            success, message = deploy_files(
                ssh=ssh_client,
                zip_path=temp_zip.name,
                deploy_path=deploy_path,
                username=vps_server.username,
                timeout=30
            )
            
            if not success:
                ssh_client.close()
                return Response(
                    {'success': False, 'message': message},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            # Настраиваем SSL если нужно
            ssl_success = True
            ssl_message = ""
            enable_ssl = vps_server.ssl_enabled
            if enable_ssl and vps_server.domain and vps_server.email:
                ssl_success, ssl_message = obtain_ssl_certificate(
                    ssh=ssh_client,
                    domain=vps_server.domain,
                    email=vps_server.email,
                    timeout=120
                )
            
            # Настраиваем Nginx если нужно
            nginx_success = True
            nginx_message = ""
            if vps_server.nginx_config_enabled:
                domain = vps_server.domain or vps_server.host
                use_ssl = enable_ssl and ssl_success
                nginx_success, nginx_message = deploy_nginx_config(
                    ssh=ssh_client,
                    domain=domain,
                    deploy_path=deploy_path,
                    username=vps_server.username,
                    use_ssl=use_ssl,
                    timeout=30
                )
            
            # Генерируем URL
            protocol = 'https' if (enable_ssl and ssl_success) else 'http'
            if vps_server.domain:
                url = f"{protocol}://{vps_server.domain}"
            else:
                url = f"{protocol}://{vps_server.host}"
            
            ssh_client.close()
            
            # Сохраняем информацию в проекте
            if project:
                project.deploy_type = 'builder_vps'
                project.deployed_url = url
                project.deployed_at = timezone.now()
                project.save(update_fields=['deploy_type', 'deployed_url', 'deployed_at'])
                print(f"✅ Проект {project_id} задеплоен на VPS сервер конструктора: {url}")
            
            final_message = f"✅ Сайт успешно задеплоен на VPS сервер конструктора ({vps_server.name})"
            if nginx_success:
                final_message += f"\n\n✅ Nginx настроен. Сайт доступен по адресу: {url}"
            else:
                final_message += f"\n\n⚠️ {nginx_message}"
            
            response_data = {
                'success': True,
                'message': final_message,
                'url': url,
                'deploy_type': 'builder_vps',
                'vps_server': vps_server.name
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        else:
            # Деплой на VPS (существующая логика)
            from .deploy_utils import (
                create_ssh_client,
                deploy_files,
                deploy_nginx_config,
                obtain_ssl_certificate
            )
            
            ssh_client = create_ssh_client(
                host=validated_data['host'],
                port=validated_data.get('port', 22),
                username=validated_data['username'],
                password=validated_data['password'],
                timeout=10
            )
            
            success, message = deploy_files(
                ssh=ssh_client,
                zip_path=temp_zip.name,
                deploy_path=validated_data['deploy_path'],
                username=validated_data['username'],
                timeout=30
            )
            
            if not success:
                return Response(
                    {'success': False, 'message': message},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
            ssl_success = True
            ssl_message = ""
            enable_ssl = validated_data.get('enable_ssl', False)
            if enable_ssl:
                domain_for_ssl = validated_data.get('domain')
                email = validated_data.get('email')
                if domain_for_ssl and email:
                    ssl_success, ssl_message = obtain_ssl_certificate(
                        ssh=ssh_client,
                        domain=domain_for_ssl,
                        email=email,
                        timeout=120
                    )
            
            nginx_success = True
            nginx_message = ""
            if validated_data.get('nginx_config', False):
                domain = validated_data.get('domain') or validated_data['host']
                use_ssl = enable_ssl and ssl_success
                nginx_success, nginx_message = deploy_nginx_config(
                    ssh=ssh_client,
                    domain=domain,
                    deploy_path=validated_data['deploy_path'],
                    username=validated_data['username'],
                    use_ssl=use_ssl,
                    timeout=30
                )
            
            domain = validated_data.get('domain')
            protocol = 'https' if (enable_ssl and ssl_success) else 'http'
            if domain:
                url = f"{protocol}://{domain}"
            else:
                url = f"{protocol}://{validated_data['host']}"
            
            final_message = message
            
            if enable_ssl:
                if ssl_success:
                    final_message += f"\n\n✅ {ssl_message}"
                else:
                    final_message += f"\n\n⚠️ SSL сертификат не получен: {ssl_message}"
            
            if not validated_data.get('nginx_config', False):
                final_message += f"\n\n⚠️ Внимание: Nginx не настроен. Файлы загружены в {validated_data['deploy_path']}, но сайт не будет доступен без веб-сервера.\n\nДля запуска сайта:\n1. Настройте Nginx или другой веб-сервер\n2. Или используйте простой HTTP-сервер: cd {validated_data['deploy_path']} && python3 -m http.server 8000"
            elif not nginx_success:
                final_message += f"\n\n⚠️ Nginx конфиг создан, но не применён: {nginx_message}\n\nПроверьте:\n1. Запущен ли Nginx: sudo systemctl status nginx\n2. Проверьте конфиг: sudo nginx -t\n3. Перезагрузите Nginx: sudo systemctl reload nginx\n4. Проверьте логи: sudo tail -f /var/log/nginx/error.log"
            else:
                final_message += f"\n\n✅ Nginx настроен и перезагружен. Сайт должен быть доступен по адресу: {url}\n\nЕсли сайт не открывается, проверьте:\n1. Открыт ли порт 80 (или 443 для HTTPS) в firewall\n2. Правильно ли указан домен/IP в Nginx конфиге\n3. Логи Nginx: sudo tail -f /var/log/nginx/error.log"
            
            if project_id:
                try:
                    project = Project.objects.get(id=project_id, user=request.user)
                    project.deploy_type = 'vps'
                    project.deployed_url = url
                    project.deployed_at = timezone.now()
                    project.save(update_fields=['deploy_type', 'deployed_url', 'deployed_at'])
                    print(f"✅ Информация о деплое сохранена для проекта {project_id}: {url}")
                except Project.DoesNotExist:
                    print(f"⚠️ Проект {project_id} не найден для пользователя {request.user.username}")
                except Exception as e:
                    print(f"❌ Ошибка при сохранении информации о деплое: {str(e)}")
            else:
                print("⚠️ project_id не указан, информация о деплое не будет сохранена")
            
            response_data = {
                'success': True,
                'message': final_message,
                'url': url,
                'deploy_path': validated_data['deploy_path'],
                'deploy_type': 'vps'
            }
            
            if enable_ssl:
                response_data['ssl'] = {
                    'success': ssl_success,
                    'message': ssl_message
                }
            
            if validated_data.get('nginx_config', False):
                response_data['nginx'] = {
                    'success': nginx_success,
                    'message': nginx_message
                }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
    except ValidationError as e:
        return Response(
            {'success': False, 'message': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'success': False, 'message': f'Ошибка деплоя: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    finally:
        # Закрываем SSH соединение
        if ssh_client:
            try:
                ssh_client.close()
            except:
                pass
        
        # Удаляем временные файлы
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except:
                pass


@require_http_methods(["GET"])
def serve_deployed_site(request, subdomain: str, path: str = ""):
    """
    Обслуживает статические файлы задеплоенного сайта
    
    Args:
        subdomain: Поддомен проекта
        path: Путь к файлу (например, index.html, styles.css, images/photo.jpg)
    
    Returns:
        FileResponse с содержимым файла или 404
    """
    from django.conf import settings
    from .subdomain_utils import get_deploy_path
    
    try:
        deploy_path = get_deploy_path(subdomain)
        
        # Если path пустой, используем index.html
        if not path or path == "":
            file_path = deploy_path / "index.html"
        else:
            file_path = deploy_path / path
        
        # Проверяем безопасность пути (защита от path traversal)
        try:
            file_path.resolve().relative_to(deploy_path.resolve())
        except ValueError:
            raise Http404("Недопустимый путь")
        
        if not file_path.exists() or not file_path.is_file():
            raise Http404("Файл не найден")
        
        # Определяем MIME тип
        content_type = "text/html"
        if file_path.suffix == ".css":
            content_type = "text/css"
        elif file_path.suffix in [".jpg", ".jpeg"]:
            content_type = "image/jpeg"
        elif file_path.suffix == ".png":
            content_type = "image/png"
        elif file_path.suffix == ".gif":
            content_type = "image/gif"
        elif file_path.suffix == ".svg":
            content_type = "image/svg+xml"
        elif file_path.suffix == ".ico":
            content_type = "image/x-icon"
        elif file_path.suffix == ".js":
            content_type = "application/javascript"
        
        file_handle = open(file_path, "rb")
        response = FileResponse(file_handle, content_type=content_type)
        response['Content-Length'] = file_path.stat().st_size
        return response
        
    except Exception as e:
        raise Http404(f"Ошибка при загрузке файла: {str(e)}")


class CustomBlockViewSet(viewsets.ModelViewSet):
    """
    ViewSet для управления кастомными блоками
    Доступен только для суперпользователей
    """
    queryset = CustomBlock.objects.filter(is_active=True)
    permission_classes = [IsAuthenticated]
    pagination_class = None
    
    def get_serializer_class(self):
        """Выбор сериализатора в зависимости от действия"""
        if self.action == 'list':
            return CustomBlockListSerializer
        return CustomBlockSerializer
    
    def get_queryset(self):
        """Фильтрация блоков"""
        queryset = super().get_queryset()
        
        if self.request.user.is_superuser:
            queryset = CustomBlock.objects.all()
        
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        if self.request.user.is_superuser:
            is_active = self.request.query_params.get('is_active', None)
            if is_active is not None:
                is_active_bool = is_active.lower() == 'true'
                queryset = queryset.filter(is_active=is_active_bool)
        
        return queryset.order_by('category', 'order', 'name')
    
    def perform_create(self, serializer):
        """Создание блока с автоматической установкой created_by"""
        serializer.save(created_by=self.request.user)
    
    def get_permissions(self):
        """Проверка прав доступа"""
        if self.action == 'list':
            return [IsAuthenticated()]
        return [IsAuthenticated()]
    
    def create(self, request, *args, **kwargs):
        """Создание блока (только для суперпользователей)"""
        if not request.user.is_superuser:
            return Response(
                {'detail': 'У вас нет прав для создания блоков. Требуются права суперпользователя.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        """Обновление блока (только для суперпользователей)"""
        if not request.user.is_superuser:
            return Response(
                {'detail': 'У вас нет прав для изменения блоков. Требуются права суперпользователя.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        """Удаление блока (только для суперпользователей)"""
        if not request.user.is_superuser:
            return Response(
                {'detail': 'У вас нет прав для удаления блоков. Требуются права суперпользователя.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
