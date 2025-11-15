"""
Сериализаторы для API
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Project, Subscription, CustomBlock
from .validators import validate_password_custom, validate_username_english


class ProjectSerializer(serializers.ModelSerializer):
    """Сериализатор для проекта"""
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Project
        fields = [
            'id',
            'user',
            'title',
            'slug',
            'description',
            'html_content',
            'css_content',
            'json_content',
            'header_settings',
            'footer_settings',
            'views_count',
            'deploy_type',
            'deployed_url',
            'deployed_at',
            'subdomain',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'views_count', 'created_at', 'updated_at']
    
    def validate_slug(self, value: str) -> str:
        """Валидация slug"""
        if not value:
            raise serializers.ValidationError("Slug не может быть пустым")
        if not value.replace('-', '').replace('_', '').isalnum():
            raise serializers.ValidationError("Slug может содержать только буквы, цифры, дефисы и подчеркивания")
        return value.lower()


class ProjectListSerializer(serializers.ModelSerializer):
    """Упрощенный сериализатор для списка проектов"""
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Project
        fields = [
            'id',
            'user',
            'title',
            'slug',
            'description',
            'views_count',
            'deploy_type',
            'deployed_url',
            'deployed_at',
            'subdomain',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'user', 'views_count', 'created_at', 'updated_at']


class ProjectCreateSerializer(serializers.ModelSerializer):
    """Сериализатор для создания проекта"""
    
    class Meta:
        model = Project
        fields = [
            'title',
            'slug',
            'description',
            'html_content',
            'css_content',
            'json_content',
            'header_settings',
            'footer_settings',
        ]
    
    def create(self, validated_data):
        """Создание проекта с автоматической установкой user"""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации пользователя"""
    password = serializers.CharField(write_only=True, validators=[validate_password_custom])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': True},
        }
    
    def validate_username(self, value):
        """Валидация имени пользователя - только английские буквы, цифры, дефисы и подчеркивания"""
        validate_username_english(value)
        return value
    
    def validate(self, attrs):
        """Проверка совпадения паролей"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs
    
    def create(self, validated_data):
        """Создание пользователя"""
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для информации о пользователе"""
    is_superuser = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'is_superuser']
        read_only_fields = ['id', 'date_joined', 'is_superuser']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Сериализатор для подписки"""
    project_limit = serializers.SerializerMethodField()
    current_project_count = serializers.SerializerMethodField()
    can_create_more = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = [
            'id',
            'subscription_type',
            'is_active',
            'created_at',
            'updated_at',
            'expires_at',
            'project_limit',
            'current_project_count',
            'can_create_more',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_project_limit(self, obj):
        """Возвращает лимит проектов"""
        limit = obj.get_project_limit()
        return limit if limit is not None else -1  # -1 означает неограниченно
    
    def get_current_project_count(self, obj):
        """Возвращает текущее количество проектов"""
        return Project.objects.filter(user=obj.user).count()
    
    def get_can_create_more(self, obj):
        """Проверяет, может ли пользователь создать еще проект"""
        count = self.get_current_project_count(obj)
        return obj.can_create_project(count)


class DeploySerializer(serializers.Serializer):
    """Сериализатор для деплоя на VPS"""
    deploy_type = serializers.ChoiceField(
        choices=[('vps', 'VPS (свой сервер)'), ('builder_vps', 'VPS сервер конструктора')],
        default='vps',
        help_text="Тип деплоя"
    )
    site_zip = serializers.FileField(required=True, help_text="ZIP архив с index.html")
    # Поля для VPS деплоя
    host = serializers.CharField(required=False, max_length=255, help_text="IP адрес или домен VPS")
    port = serializers.IntegerField(required=False, default=22, min_value=1, max_value=65535, help_text="SSH порт")
    username = serializers.CharField(required=False, max_length=100, help_text="SSH пользователь (не root)")
    password = serializers.CharField(required=False, write_only=True, help_text="SSH пароль")
    deploy_path = serializers.CharField(required=False, max_length=500, help_text="Путь на VPS (например: /var/www/my-site)")
    domain = serializers.CharField(required=False, max_length=255, allow_blank=True, help_text="Домен для Nginx конфига")
    email = serializers.EmailField(required=False, allow_blank=True, help_text="Email для Let's Encrypt SSL сертификата")
    nginx_config = serializers.BooleanField(required=False, default=False, help_text="Нужен ли Nginx конфиг")
    enable_ssl = serializers.BooleanField(required=False, default=False, help_text="Получить SSL сертификат через Let's Encrypt")
    project_id = serializers.IntegerField(required=False, allow_null=True, help_text="ID проекта для сохранения информации о деплое")
    
    def validate_username(self, value):
        """Валидация имени пользователя"""
        from .deploy_utils import validate_username
        try:
            validate_username(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate_host(self, value):
        """Валидация хоста"""
        from .deploy_utils import validate_host
        try:
            validate_host(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate_deploy_path(self, value):
        """Валидация пути развёртывания"""
        from .deploy_utils import validate_deploy_path
        try:
            validate_deploy_path(value)
        except Exception as e:
            raise serializers.ValidationError(str(e))
        return value
    
    def validate_password(self, value):
        """Валидация пароля"""
        if not value or len(value.strip()) == 0:
            raise serializers.ValidationError("Пароль не может быть пустым")
        return value
    
    def validate(self, attrs):
        """Валидация зависимостей между полями"""
        deploy_type = attrs.get('deploy_type', 'vps')
        
        if deploy_type == 'vps':
            # Валидация для VPS деплоя
            if not attrs.get('host'):
                raise serializers.ValidationError({'host': 'Host обязателен для VPS деплоя'})
            if not attrs.get('username'):
                raise serializers.ValidationError({'username': 'Username обязателен для VPS деплоя'})
            if not attrs.get('password'):
                raise serializers.ValidationError({'password': 'Password обязателен для VPS деплоя'})
            if not attrs.get('deploy_path'):
                raise serializers.ValidationError({'deploy_path': 'Deploy path обязателен для VPS деплоя'})
            
            enable_ssl = attrs.get('enable_ssl', False)
            email = attrs.get('email', '')
            domain = attrs.get('domain', '')
            
            if enable_ssl:
                if not email or not email.strip():
                    raise serializers.ValidationError({
                        'email': 'Email обязателен для получения SSL сертификата'
                    })
                if not domain or not domain.strip():
                    raise serializers.ValidationError({
                        'domain': 'Домен обязателен для получения SSL сертификата'
                    })
        elif deploy_type == 'builder_vps':
            pass
        
        return attrs


class CustomBlockSerializer(serializers.ModelSerializer):
    """Сериализатор для кастомного блока"""
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = CustomBlock
        fields = [
            'id',
            'name',
            'block_id',
            'category',
            'description',
            'preview',
            'content',
            'label',
            'media',
            'is_active',
            'order',
            'attributes',
            'traits',
            'component_type',
            'created_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
    
    def validate_block_id(self, value: str) -> str:
        """Валидация block_id"""
        if not value:
            raise serializers.ValidationError("ID блока не может быть пустым")
        if not value.replace('-', '').replace('_', '').isalnum():
            raise serializers.ValidationError("ID блока может содержать только буквы, цифры, дефисы и подчеркивания")
        return value.lower()
    
    def validate_content(self, value: str) -> str:
        """Валидация содержимого"""
        if not value or not value.strip():
            raise serializers.ValidationError("Содержимое блока не может быть пустым")
        return value


class CustomBlockListSerializer(serializers.ModelSerializer):
    """Упрощенный сериализатор для списка блоков"""
    created_by = serializers.ReadOnlyField(source='created_by.username')
    
    class Meta:
        model = CustomBlock
        fields = [
            'id',
            'name',
            'block_id',
            'category',
            'description',
            'preview',
            'is_active',
            'order',
            'created_by',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

