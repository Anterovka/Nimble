"""
Утилиты для безопасного деплоя на VPS через SSH
"""
import os
import tempfile
import zipfile
import re
from pathlib import Path
from typing import Tuple, Optional
import paramiko
from django.core.exceptions import ValidationError


def safe_decode(data: bytes, default: str = '') -> str:
    """Безопасно декодирует байты в UTF-8 строку с обработкой ошибок"""
    if not data:
        return default
    try:
        return data.decode('utf-8')
    except UnicodeDecodeError:
        try:
            return data.decode('utf-8', errors='ignore')
        except Exception:
            return default


def validate_host(host: str) -> None:
    """Валидация хоста (IP или домен)"""
    ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
    domain_pattern = r'^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
    
    if not (re.match(ip_pattern, host) or re.match(domain_pattern, host)):
        raise ValidationError("Некорректный формат хоста. Используйте IP адрес или домен.")


def validate_deploy_path(path: str) -> None:
    """Валидация пути развёртывания"""
    forbidden_patterns = [
        r'\.\.',
        r'^/etc',
        r'^/root',
        r'^/bin',
        r'^/sbin',
        r'^/usr/bin',
        r'^/usr/sbin',
        r'^/var/log',
    ]
    
    for pattern in forbidden_patterns:
        if re.search(pattern, path):
            raise ValidationError(f"Запрещённый путь развёртывания: {path}")
    
    if not path.startswith('/'):
        raise ValidationError("Путь развёртывания должен быть абсолютным (начинаться с /)")


def validate_username(username: str) -> None:
    """Валидация имени пользователя SSH"""
    if not username:
        raise ValidationError("Имя пользователя не может быть пустым.")
    
    if not re.match(r'^[a-zA-Z0-9_-]+$', username):
        raise ValidationError("Имя пользователя может содержать только буквы, цифры, дефисы и подчёркивания.")


def create_ssh_client(
    host: str,
    port: int,
    username: str,
    password: str,
    timeout: int = 10
) -> paramiko.SSHClient:
    """Создаёт и подключает SSH клиент с валидацией параметров и аутентификацией по паролю"""
    validate_host(host)
    validate_username(username)
    
    if port < 1 or port > 65535:
        raise ValidationError("Некорректный порт SSH (должен быть от 1 до 65535)")
    
    if not password:
        raise ValidationError("Пароль не может быть пустым")
    
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        ssh.connect(
            hostname=host,
            port=port,
            username=username,
            password=password,
            timeout=timeout,
            look_for_keys=False,
            allow_agent=False
        )
        
        return ssh
                
    except paramiko.AuthenticationException:
        raise ValidationError("Ошибка аутентификации SSH. Проверьте пароль и пользователя.")
    except paramiko.SSHException as e:
        raise ValidationError(f"Ошибка SSH подключения: {str(e)}")
    except Exception as e:
        raise ValidationError(f"Ошибка подключения к VPS: {str(e)}")


def deploy_files(
    ssh: paramiko.SSHClient,
    zip_path: str,
    deploy_path: str,
    username: str,
    timeout: int = 30
) -> Tuple[bool, str]:
    """Распаковывает ZIP архив и загружает файлы (index.html, styles.css, images) на VPS через SFTP, устанавливает права доступа"""
    validate_deploy_path(deploy_path)
    
    sftp = None
    try:
        extract_dir = tempfile.mkdtemp()
        
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(extract_dir)
            
            index_path = os.path.join(extract_dir, 'index.html')
            if not os.path.exists(index_path):
                return False, "В архиве отсутствует index.html"
            
            sftp = ssh.open_sftp()
            
            commands = [
                f"mkdir -p {deploy_path}",
                f"chmod 755 {deploy_path}",
                f"chown -R $USER:$USER {deploy_path}"
            ]
            
            for cmd in commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    if 'chown' not in cmd or 'Permission denied' not in error:
                        return False, f"Ошибка создания директории: {error}"
            
            remote_index_path = f"{deploy_path}/index.html"
            sftp.put(index_path, remote_index_path)
            
            css_path = os.path.join(extract_dir, 'styles.css')
            if os.path.exists(css_path):
                css_size = os.path.getsize(css_path)
                if css_size == 0:
                    print(f"⚠️ Предупреждение: styles.css пустой!")
                else:
                    print(f"📄 Найден styles.css ({css_size} байт)")
                
                remote_css_path = f"{deploy_path}/styles.css"
                sftp.put(css_path, remote_css_path)
                
                stdin, stdout, stderr = ssh.exec_command(
                    f"test -f {remote_css_path} && stat -c '%s' {remote_css_path} || echo '0'",
                    timeout=timeout
                )
                remote_css_size = safe_decode(stdout.read()).strip()
                if remote_css_size == '0':
                    error = safe_decode(stderr.read())
                    print(f"⚠️ Предупреждение: styles.css не найден на сервере после загрузки: {error}")
                elif int(remote_css_size) != css_size:
                    print(f"⚠️ Предупреждение: размер styles.css не совпадает (локально: {css_size}, на сервере: {remote_css_size})")
                else:
                    print(f"📄 Загружен styles.css ({css_size} байт)")
            else:
                print(f"⚠️ Предупреждение: styles.css не найден в архиве!")
            
            images_dir = os.path.join(extract_dir, 'images')
            if os.path.exists(images_dir) and os.path.isdir(images_dir):
                remote_images_dir = f"{deploy_path}/images"
                stdin, stdout, stderr = ssh.exec_command(f"mkdir -p {remote_images_dir}", timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    return False, f"Ошибка создания папки images: {error}"
                
                image_files = [f for f in os.listdir(images_dir) if os.path.isfile(os.path.join(images_dir, f))]
                for image_file in image_files:
                    local_image_path = os.path.join(images_dir, image_file)
                    remote_image_path = f"{remote_images_dir}/{image_file}"
                    
                    file_size = os.path.getsize(local_image_path)
                    if file_size == 0:
                        print(f"⚠️ Предупреждение: файл {image_file} пустой, пропускаем")
                        continue
                    
                    sftp.put(local_image_path, remote_image_path)
                    
                    stdin, stdout, stderr = ssh.exec_command(
                        f"test -f {remote_image_path} && stat -c '%s' {remote_image_path} || echo '0'",
                        timeout=timeout
                    )
                    remote_size = safe_decode(stdout.read()).strip()
                    if remote_size == '0' or int(remote_size) != file_size:
                        error = safe_decode(stderr.read())
                        return False, f"Ошибка загрузки изображения {image_file}: размер не совпадает (локально: {file_size}, на сервере: {remote_size})"
                    
                    print(f"🖼️ Загружено изображение: {image_file} ({file_size} байт)")
            
            chown_commands = [
                f"sudo chown -R {username}:{username} {deploy_path}",
            ]
            
            for cmd in chown_commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    cmd_no_sudo = cmd.replace('sudo ', '')
                    stdin, stdout, stderr = ssh.exec_command(cmd_no_sudo, timeout=timeout)
                    exit_status = stdout.channel.recv_exit_status()
                    if exit_status != 0:
                        error = safe_decode(stderr.read())
                        print(f"⚠️ Предупреждение: не удалось установить владельца ({cmd}): {error}")
            
            commands = [
                f"sudo chmod 755 {deploy_path}",
                f"sudo chmod 644 {remote_index_path}",
            ]
            
            if os.path.exists(css_path):
                commands.append(f"sudo chmod 644 {deploy_path}/styles.css")
            
            if os.path.exists(images_dir) and os.path.isdir(images_dir):
                commands.append(f"sudo chmod 755 {deploy_path}/images")
                image_files = [f for f in os.listdir(images_dir) if os.path.isfile(os.path.join(images_dir, f))]
                for image_file in image_files:
                    commands.append(f"sudo chmod 644 {deploy_path}/images/{image_file}")
            
            path_parts = deploy_path.strip('/').split('/')
            for i in range(1, len(path_parts) + 1):
                parent_path = '/' + '/'.join(path_parts[:i])
                if parent_path != '/':
                    commands.append(f"sudo chmod 755 {parent_path}")
            
            for cmd in commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    cmd_no_sudo = cmd.replace('sudo ', '')
                    stdin, stdout, stderr = ssh.exec_command(cmd_no_sudo, timeout=timeout)
                    exit_status = stdout.channel.recv_exit_status()
                    if exit_status != 0:
                        error = safe_decode(stderr.read())
                        if 'chmod 755' in cmd and parent_path in cmd:
                            print(f"⚠️ Предупреждение: не удалось установить права для {parent_path}: {error}")
                        else:
                            return False, f"Ошибка установки прав ({cmd}): {error}"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -f {remote_index_path} && echo 'OK' || echo 'FAIL'",
                timeout=timeout
            )
            check_result = safe_decode(stdout.read()).strip()
            if check_result != 'OK':
                return False, f"Файл не найден после загрузки: {remote_index_path}"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"ls -lh {remote_index_path} && stat -c '%a %U:%G' {remote_index_path}",
                timeout=timeout
            )
            file_info = safe_decode(stdout.read()).strip()
            if file_info:
                print(f"📄 Информация о файле: {file_info}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"sudo -u {username} test -r {remote_index_path} && echo 'READABLE' || echo 'NOT_READABLE'",
                timeout=timeout
            )
            readable_check = safe_decode(stdout.read()).strip()
            if readable_check != 'READABLE':
                error = safe_decode(stderr.read())
                print(f"⚠️ Предупреждение: файл может быть недоступен для чтения пользователем {username}: {error}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -r {remote_index_path} && echo 'READABLE' || echo 'NOT_READABLE'",
                timeout=timeout
            )
            world_readable = safe_decode(stdout.read()).strip()
            if world_readable != 'READABLE':
                error = safe_decode(stderr.read())
                print(f"⚠️ Предупреждение: файл не читаемый для всех пользователей. Исправляем права...")
                stdin, stdout, stderr = ssh.exec_command(
                    f"sudo chmod 644 {remote_index_path}",
                    timeout=timeout
                )
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    print(f"❌ Не удалось исправить права доступа: {safe_decode(stderr.read())}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"head -n 5 {remote_index_path}",
                timeout=timeout
            )
            file_preview = safe_decode(stdout.read()).strip()
            if file_preview:
                print(f"📋 Первые строки index.html: {file_preview[:200]}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"wc -c < {remote_index_path}",
                timeout=timeout
            )
            file_size = safe_decode(stdout.read()).strip()
            if file_size and int(file_size) == 0:
                return False, f"Файл index.html пустой! Размер: {file_size} байт"
            print(f"📏 Размер index.html: {file_size} байт")
            
            import shutil
            shutil.rmtree(extract_dir)
            
            return True, f"Файлы успешно загружены в {deploy_path}"
            
        except zipfile.BadZipFile:
            return False, "Некорректный формат ZIP архива"
        except Exception as e:
            return False, f"Ошибка при развёртывании: {str(e)}"
        finally:
            if os.path.exists(extract_dir):
                import shutil
                shutil.rmtree(extract_dir)
                
    finally:
        if sftp:
            sftp.close()


def generate_nginx_config(
    domain: str,
    deploy_path: str,
    server_name: Optional[str] = None,
    use_ssl: bool = False,
    config_name: Optional[str] = None
) -> str:
    """Генерирует Nginx конфигурацию для статического сайта с поддержкой SSL и кеширования"""
    server_name = server_name or domain
    
    is_ip = re.match(r'^(\d{1,3}\.){3}\d{1,3}$', domain)
    if is_ip:
        server_name = '_'
    
    log_name = config_name.replace('.conf', '') if config_name else domain.replace('.', '-')
    
    if use_ssl:
        ssl_domain = domain if not is_ip else server_name
        
        config = f"""server {{
    listen 80;
    server_name {server_name};
    return 301 https://{ssl_domain}$request_uri;
}}

server {{
    listen 443 ssl http2;
    server_name {server_name};
    ssl_certificate /etc/letsencrypt/live/{ssl_domain}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{ssl_domain}/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    root {deploy_path};
    index index.html index.htm;
    access_log /var/log/nginx/{log_name}_access.log;
    error_log /var/log/nginx/{log_name}_error.log;
    location / {{
        try_files $uri $uri/ /index.html;
    }}
    location = /favicon.ico {{
        log_not_found off;
        access_log off;
    }}
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}
    location ~ /\\. {{
        deny all;
        access_log off;
        log_not_found off;
    }}
}}
"""
    else:
        config = f"""server {{
    listen 80;
    server_name {server_name};
    root {deploy_path};
    index index.html index.htm;
    access_log /var/log/nginx/{log_name}_access.log;
    error_log /var/log/nginx/{log_name}_error.log;
    location / {{
        try_files $uri $uri/ /index.html;
    }}
    location = /favicon.ico {{
        log_not_found off;
        access_log off;
    }}
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
    }}
    location ~ /\\. {{
        deny all;
        access_log off;
        log_not_found off;
    }}
}}
"""
    return config


def obtain_ssl_certificate(
    ssh: paramiko.SSHClient,
    domain: str,
    email: str,
    timeout: int = 120
) -> Tuple[bool, str]:
    """Получает SSL сертификат через Let's Encrypt certbot в standalone режиме"""
    try:
        stdin, stdout, stderr = ssh.exec_command("which certbot", timeout=10)
        exit_status = stdout.channel.recv_exit_status()
        
        if exit_status != 0:
            install_commands = [
                "apt-get update",
                "apt-get install -y certbot python3-certbot-nginx"
            ]
            
            for cmd in install_commands:
                stdin, stdout, stderr = ssh.exec_command(f"sudo {cmd}", timeout=60)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    return False, f"Ошибка установки certbot: {error}. Убедитесь, что у пользователя есть права sudo."
        
        ssh.exec_command("sudo systemctl stop nginx", timeout=10)
        
        try:
            certbot_cmd = (
                f"sudo certbot certonly --standalone --non-interactive "
                f"--agree-tos --email {email} -d {domain} "
                f"--preferred-challenges http"
            )
            
            stdin, stdout, stderr = ssh.exec_command(certbot_cmd, timeout=timeout)
            exit_status = stdout.channel.recv_exit_status()
            
            ssh.exec_command("sudo systemctl start nginx", timeout=10)
            
            if exit_status == 0:
                return True, f"SSL сертификат успешно получен для {domain}"
            else:
                error = safe_decode(stderr.read())
                output = safe_decode(stdout.read())
                error_msg = error if error else output
                
                if "port 80" in error_msg.lower() or "already in use" in error_msg.lower():
                    return False, f"Порт 80 занят. Убедитесь, что Nginx или другой веб-сервер не запущен, или используйте --webroot метод."
                elif "connection refused" in error_msg.lower():
                    return False, f"Не удалось подключиться к домену. Убедитесь, что домен указывает на этот сервер и порт 80 открыт."
                elif "rate limit" in error_msg.lower():
                    return False, f"Превышен лимит запросов Let's Encrypt. Попробуйте позже."
                else:
                    return False, f"Ошибка получения SSL сертификата: {error_msg}"
                    
        except Exception as e:
            ssh.exec_command("sudo systemctl start nginx", timeout=10)
            raise e
                
    except Exception as e:
        return False, f"Ошибка при получении SSL сертификата: {str(e)}"


def deploy_nginx_config(
    ssh: paramiko.SSHClient,
    domain: str,
    deploy_path: str,
    username: str,
    config_name: str = None,
    use_ssl: bool = False,
    timeout: int = 30
) -> Tuple[bool, str]:
    """Генерирует Nginx конфиг, загружает на сервер, создаёт симлинк, проверяет и перезагружает Nginx"""
    if not config_name:
        config_name = domain.replace('.', '-') + '.conf'
    
    config_content = generate_nginx_config(domain, deploy_path, use_ssl=use_ssl, config_name=config_name)
    
    try:
        with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.conf') as config_file:
            config_file.write(config_content)
            config_file_path = config_file.name
        
        try:
            sftp = ssh.open_sftp()
            
            remote_config_path = f"/etc/nginx/sites-available/{config_name}"
            sftp.put(config_file_path, remote_config_path)
            
            commands = [
                f"ln -sf /etc/nginx/sites-available/{config_name} /etc/nginx/sites-enabled/{config_name}",
            ]
            
            for cmd in commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    cmd_with_sudo = f"sudo {cmd}"
                    stdin, stdout, stderr = ssh.exec_command(cmd_with_sudo, timeout=timeout)
                    exit_status = stdout.channel.recv_exit_status()
                    if exit_status != 0:
                        error = safe_decode(stderr.read())
                        return False, f"Ошибка создания симлинка Nginx: {error}. Возможно, нужны права sudo."
            
            stdin, stdout, stderr = ssh.exec_command("systemctl is-active nginx", timeout=timeout)
            nginx_status = safe_decode(stdout.read()).strip()
            if nginx_status != 'active':
                stdin, stdout, stderr = ssh.exec_command("sudo systemctl start nginx", timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    return False, f"Nginx не запущен и не удалось его запустить: {error}. Выполните вручную: sudo systemctl start nginx"
            
            nginx_commands = ["nginx -t"]
            
            for cmd in nginx_commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    cmd_with_sudo = f"sudo {cmd}"
                    stdin, stdout, stderr = ssh.exec_command(cmd_with_sudo, timeout=timeout)
                    exit_status = stdout.channel.recv_exit_status()
                    if exit_status != 0:
                        error = safe_decode(stderr.read())
                        output = safe_decode(stdout.read())
                        full_error = error if error else output
                        return False, f"Ошибка проверки конфига Nginx: {full_error}"
            
            reload_commands = ["systemctl reload nginx", "systemctl restart nginx"]
            
            reload_success = False
            for cmd in reload_commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status == 0:
                    reload_success = True
                    break
                else:
                    cmd_with_sudo = f"sudo {cmd}"
                    stdin, stdout, stderr = ssh.exec_command(cmd_with_sudo, timeout=timeout)
                    exit_status = stdout.channel.recv_exit_status()
                    if exit_status == 0:
                        reload_success = True
                        break
            
            if not reload_success:
                error = safe_decode(stderr.read())
                return False, f"Конфиг создан и проверен, но не удалось перезагрузить Nginx: {error}. Выполните вручную: sudo systemctl reload nginx"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -L /etc/nginx/sites-enabled/{config_name} && echo 'OK' || echo 'FAIL'",
                timeout=timeout
            )
            symlink_check = safe_decode(stdout.read()).strip()
            if symlink_check != 'OK':
                return False, f"Симлинк Nginx не создан. Проверьте: ls -la /etc/nginx/sites-enabled/{config_name}"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -f {deploy_path}/index.html && echo 'EXISTS' || echo 'NOT_EXISTS'",
                timeout=timeout
            )
            index_check = safe_decode(stdout.read()).strip()
            if index_check != 'EXISTS':
                return False, f"Файл index.html не найден в {deploy_path}. Проверьте путь развёртывания."
            
            stdin, stdout, stderr = ssh.exec_command(
                f"ls -la {deploy_path}/index.html && stat -c '%a %U:%G' {deploy_path}/index.html",
                timeout=timeout
            )
            file_perms = safe_decode(stdout.read()).strip()
            print(f"📄 Права доступа к index.html: {file_perms}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"ls -ld {deploy_path} && stat -c '%a %U:%G' {deploy_path}",
                timeout=timeout
            )
            dir_perms = safe_decode(stdout.read()).strip()
            print(f"📁 Права доступа к директории: {dir_perms}")
            
            chown_commands = [f"sudo chown -R {username}:{username} {deploy_path}"]
            
            for cmd in chown_commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    print(f"⚠️ Предупреждение при установке владельца ({cmd}): {error}")
            
            commands = [
                f"sudo chmod 755 {deploy_path}",
                f"sudo chmod 644 {deploy_path}/index.html",
            ]
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -f {deploy_path}/styles.css && echo 'EXISTS' || echo 'NOT_EXISTS'",
                timeout=timeout
            )
            css_check = safe_decode(stdout.read()).strip()
            if css_check == 'EXISTS':
                commands.append(f"sudo chmod 644 {deploy_path}/styles.css")
                stdin, stdout, stderr = ssh.exec_command(
                    f"stat -c '%s' {deploy_path}/styles.css",
                    timeout=timeout
                )
                css_size = safe_decode(stdout.read()).strip()
                print(f"📄 CSS файл найден, размер: {css_size} байт")
                stdin, stdout, stderr = ssh.exec_command(
                    f"head -n 3 {deploy_path}/styles.css",
                    timeout=timeout
                )
                css_preview = safe_decode(stdout.read()).strip()
                if css_preview:
                    print(f"📋 Первые строки CSS: {css_preview[:200]}")
            else:
                print(f"❌ ВНИМАНИЕ: styles.css не найден в {deploy_path}!")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -d {deploy_path}/images && echo 'EXISTS' || echo 'NOT_EXISTS'",
                timeout=timeout
            )
            images_check = safe_decode(stdout.read()).strip()
            if images_check == 'EXISTS':
                commands.append(f"sudo chmod 755 {deploy_path}/images")
                stdin, stdout, stderr = ssh.exec_command(
                    f"find {deploy_path}/images -type f -exec sudo chmod 644 {{}} \\;",
                    timeout=timeout
                )
            
            for cmd in commands:
                stdin, stdout, stderr = ssh.exec_command(cmd, timeout=timeout)
                exit_status = stdout.channel.recv_exit_status()
                if exit_status != 0:
                    error = safe_decode(stderr.read())
                    print(f"⚠️ Предупреждение при установке прав ({cmd}): {error}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"sudo -u {username} test -r {deploy_path}/index.html && echo 'READABLE' || echo 'NOT_READABLE'",
                timeout=timeout
            )
            readable_check = safe_decode(stdout.read()).strip()
            if readable_check != 'READABLE':
                return False, f"Файл не читаемый для пользователя {username} после установки прав. Проверьте вручную: sudo -u {username} test -r {deploy_path}/index.html"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"sudo -u {username} test -x {deploy_path} && echo 'ACCESSIBLE' || echo 'NOT_ACCESSIBLE'",
                timeout=timeout
            )
            dir_accessible = safe_decode(stdout.read()).strip()
            if dir_accessible != 'ACCESSIBLE':
                return False, f"Директория не доступна для пользователя {username}. Проверьте вручную: sudo -u {username} test -x {deploy_path}"
            
            stdin, stdout, stderr = ssh.exec_command("sudo nginx -t", timeout=timeout)
            exit_status = stdout.channel.recv_exit_status()
            if exit_status != 0:
                error = safe_decode(stderr.read())
                output = safe_decode(stdout.read())
                full_error = error if error else output
                print(f"❌ Ошибка проверки конфига Nginx:\n{full_error}")
                return False, f"Ошибка в конфиге Nginx после применения: {full_error}"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"cat /etc/nginx/sites-available/{config_name}",
                timeout=timeout
            )
            config_content = safe_decode(stdout.read()).strip()
            if config_content:
                print(f"📋 Полный конфиг Nginx:\n{config_content}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -d {deploy_path} && echo 'EXISTS' || echo 'NOT_EXISTS'",
                timeout=timeout
            )
            path_exists = safe_decode(stdout.read()).strip()
            if path_exists != 'EXISTS':
                return False, f"Путь {deploy_path} не существует на сервере!"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"test -f {deploy_path}/index.html && echo 'EXISTS' || echo 'NOT_EXISTS'",
                timeout=timeout
            )
            index_exists = safe_decode(stdout.read()).strip()
            if index_exists != 'EXISTS':
                return False, f"Файл {deploy_path}/index.html не существует!"
            
            stdin, stdout, stderr = ssh.exec_command(
                f"sudo -u {username} ls -la {deploy_path}/index.html",
                timeout=timeout
            )
            user_ls = safe_decode(stdout.read()).strip()
            if user_ls:
                print(f"📄 Список файлов от {username}: {user_ls}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"sudo -u {username} cat {deploy_path}/index.html | head -n 1",
                timeout=timeout
            )
            user_read = safe_decode(stdout.read()).strip()
            if user_read:
                print(f"✓ {username} может прочитать файл. Первая строка: {user_read[:100]}")
            else:
                error_read = safe_decode(stderr.read()).strip()
                if error_read:
                    print(f"❌ Ошибка чтения файла {username}: {error_read}")
            
            stdin, stdout, stderr = ssh.exec_command("sudo systemctl reload nginx", timeout=timeout)
            exit_status = stdout.channel.recv_exit_status()
            if exit_status != 0:
                error = safe_decode(stderr.read())
                return False, f"Не удалось перезагрузить Nginx: {error}"
            
            stdin, stdout, stderr = ssh.exec_command("sudo systemctl status nginx --no-pager | head -n 5", timeout=timeout)
            nginx_status_info = safe_decode(stdout.read()).strip()
            print(f"📊 Статус Nginx: {nginx_status_info}")
            
            stdin, stdout, stderr = ssh.exec_command("sudo systemctl is-active nginx", timeout=timeout)
            nginx_active = safe_decode(stdout.read()).strip()
            if nginx_active != 'active':
                return False, f"Nginx не активен после перезагрузки. Статус: {nginx_active}"
            
            try:
                stdin, stdout, stderr = ssh.exec_command(
                    "sudo tail -n 20 /var/log/nginx/error.log",
                    timeout=timeout
                )
                nginx_errors = safe_decode(stdout.read())
                if nginx_errors:
                    print(f"⚠️ Последние ошибки Nginx:\n{nginx_errors}")
                    if "502" in nginx_errors or "Bad Gateway" in nginx_errors or "Permission denied" in nginx_errors:
                        return False, f"Ошибка Nginx (502 Bad Gateway). Логи:\n{nginx_errors}\n\nПроверьте:\n1. Права доступа: sudo chmod 755 {deploy_path} && sudo chmod 644 {deploy_path}/index.html\n2. Владелец: sudo chown -R {username}:{username} {deploy_path}\n3. Логи: sudo tail -f /var/log/nginx/error.log"
            except Exception as e:
                print(f"⚠️ Не удалось прочитать логи Nginx: {str(e)}")
            
            stdin, stdout, stderr = ssh.exec_command(
                f"curl -I http://localhost/styles.css 2>&1 | head -n 5",
                timeout=timeout
            )
            css_http_check = safe_decode(stdout.read()).strip()
            if css_http_check:
                print(f"🌐 Проверка доступности CSS через HTTP:\n{css_http_check}")
                if "404" in css_http_check or "Not Found" in css_http_check:
                    print(f"❌ ВНИМАНИЕ: CSS файл не доступен через HTTP (404)!")
                elif "200" in css_http_check or "OK" in css_http_check:
                    print(f"✓ CSS файл доступен через HTTP")
            
            try:
                stdin, stdout, stderr = ssh.exec_command(
                    f"curl -I http://localhost/ 2>&1 | head -n 5",
                    timeout=timeout
                )
                curl_output = safe_decode(stdout.read()).strip()
                if curl_output:
                    print(f"🌐 Тест curl к localhost:\n{curl_output}")
                    if "502" in curl_output or "Bad Gateway" in curl_output:
                        return False, f"502 Bad Gateway при тестировании. Вывод curl:\n{curl_output}\n\nПроверьте логи: sudo tail -f /var/log/nginx/error.log"
            except Exception as e:
                print(f"⚠️ Не удалось выполнить тест curl: {str(e)}")
            
            sftp.close()
            
            return True, f"Nginx конфиг успешно применён: {config_name}. Сайт должен быть доступен по указанному адресу."
            
        finally:
            if os.path.exists(config_file_path):
                os.unlink(config_file_path)
                
    except Exception as e:
        return False, f"Ошибка при настройке Nginx: {str(e)}"

