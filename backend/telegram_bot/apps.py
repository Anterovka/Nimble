from django.apps import AppConfig
import asyncio
import threading
import sys
import os


_bot_thread = None
_bot_lock = threading.Lock()
_bot_started = False


class TelegramBotConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'telegram_bot'

    def ready(self):
        global _bot_thread, _bot_started
        
        if 'runserver' not in sys.argv:
            return
        
        if os.environ.get('RUN_MAIN') != 'true':
            return
        
        with _bot_lock:
            if _bot_started:
                return
            
            _bot_started = True
            
            from .bot import start_bot
            
            def run_bot():
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                try:
                    loop.run_until_complete(start_bot())
                except KeyboardInterrupt:
                    pass
                except Exception as e:
                    print(f"Ошибка запуска бота: {e}")
                finally:
                    try:
                        loop.close()
                    except:
                        pass
            
            _bot_thread = threading.Thread(target=run_bot, daemon=True)
            _bot_thread.start()

