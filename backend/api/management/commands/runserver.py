import threading
import asyncio
from django.core.management.commands.runserver import Command as BaseRunserverCommand
import os

# Флаг для предотвращения двойного запуска бота при перезагрузке Django
_bot_started = False


def start_bot():
    global _bot_started
    
    # Предотвращаем двойной запуск при перезагрузке Django (в dev режиме)
    if os.environ.get('RUN_MAIN') != 'true':
        return
    
    if _bot_started:
        return
    
    from api.management.commands.support_bot import run_bot
    
    def run_async():
        global _bot_started
        try:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
            loop.run_until_complete(run_bot())
        except Exception as e:
            print(f"Ошибка запуска бота: {e}")
        finally:
            _bot_started = False
    
    _bot_started = True
    bot_thread = threading.Thread(target=run_async, daemon=True)
    bot_thread.start()
    print("✅ Telegram бот поддержки запущен в фоновом режиме")


class Command(BaseRunserverCommand):
    help = 'Запускает Django сервер и Telegram бота поддержки одновременно'

    def handle(self, *args, **options):
        enable_bot = os.getenv('ENABLE_TELEGRAM_BOT', 'True') == 'True'
        
        if enable_bot:
            try:
                start_bot()
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(
                        f'⚠️ Не удалось запустить бота: {e}. '
                        'Сервер продолжит работу без бота.'
                    )
                )
        else:
            self.stdout.write(
                self.style.WARNING('Telegram бот отключен (ENABLE_TELEGRAM_BOT=False)')
            )
        
        super().handle(*args, **options)

