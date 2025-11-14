import asyncio
import threading
from django.core.management.base import BaseCommand
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command, StateFilter
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.fsm.context import FSMContext
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
import os
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '8570759967:AAGlp-BDexuQP2WMvWVuatszi9x9bY6oLQc')
SUPPORT_CHAT_ID = os.getenv('TELEGRAM_SUPPORT_CHAT_ID', '-1001234567890')
SUPPORT_USER_IDS = [int(x) for x in os.getenv('TELEGRAM_SUPPORT_USER_IDS', '8490807800').split(',') if x.strip()]

storage = MemoryStorage()
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=storage)

class SupportStates(StatesGroup):
    waiting_for_message = State()

current_reply_target = {}

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    welcome_text = (
        "Привет! 👋\n\n"
        "Я бот поддержки сайта по созданию сайтов (типа Tilda).\n"
        "Вы можете задать вопрос, посмотреть FAQ или связаться с поддержкой.\n\n"
        "Доступные команды:\n"
        "/help — помощь\n"
        "/faq — часто задаваемые вопросы\n"
        "/support — отправить сообщение в поддержку"
    )
    await message.answer(welcome_text)

@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    help_text = (
        "Вот, что я могу:\n\n"
        "/start — начать общение\n"
        "/help — это сообщение\n"
        "/faq — часто задаваемые вопросы\n"
        "/support — написать в поддержку\n\n"
        "Если у вас есть вопрос, просто напишите его мне, и я постараюсь помочь."
    )
    await message.answer(help_text)

@dp.message(Command("faq"))
async def cmd_faq(message: types.Message):
    faq_text = (
        "Часто задаваемые вопросы:\n\n"
        "1. Как начать создание сайта?\n"
        "   — Зайдите на сайт и зарегистрируйтесь. Выберите шаблон и начните редактировать.\n\n"
        "2. Можно ли оплатить подписку позже?\n"
        "   — Да, вы можете использовать пробный период.\n\n"
        "3. Где найти инструкции по дизайну?\n"
        "   — В разделе 'Помощь' на сайте есть обучающие видео и статьи.\n\n"
        "4. Поддерживаете ли вы домены?\n"
        "   — Да, вы можете подключить свой домен в настройках сайта."
    )
    await message.answer(faq_text)

@dp.message(Command("support"))
async def cmd_support(message: types.Message, state: FSMContext):
    await state.set_state(SupportStates.waiting_for_message)
    await message.answer(
        "Теперь вы можете написать ваше сообщение в поддержку. "
        "Я перешлю его команде поддержки, и они ответят вам."
    )

@dp.message(StateFilter(SupportStates.waiting_for_message))
async def process_user_message(message: types.Message, state: FSMContext):
    user_id = message.from_user.id
    username = message.from_user.username or "Без имени"
    text = message.text or message.caption or "Без текста"

    try:
        await bot.send_message(
            chat_id=SUPPORT_CHAT_ID,
            text=f"Сообщение от пользователя @{username} (ID: {user_id}):\n\n{text}",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="Ответить пользователю", callback_data=f"reply_{user_id}")]
            ])
        )
        await message.answer("Ваше сообщение отправлено в поддержку. Ожидайте ответа.")
        await state.clear()
    except Exception as e:
        await message.answer("Произошла ошибка при отправке сообщения. Попробуйте позже.")

@dp.callback_query(lambda c: c.data.startswith("reply_"))
async def process_callback_reply(callback_query: types.CallbackQuery):
    user_id = int(callback_query.data.split("_")[1])
    await callback_query.answer("Теперь вы можете ответить пользователю. Ваше следующее сообщение будет отправлено ему.")
    
    current_reply_target[callback_query.from_user.id] = user_id
    
    await bot.send_message(
        chat_id=callback_query.from_user.id,
        text=f"Введите ваш ответ пользователю с ID: {user_id}."
    )

@dp.message(lambda m: m.from_user.id in SUPPORT_USER_IDS and m.text and current_reply_target.get(m.from_user.id))
async def handle_admin_reply(message: types.Message):
    target_user_id = current_reply_target.get(message.from_user.id)
    if not target_user_id:
        return
    
    try:
        await bot.send_message(chat_id=target_user_id, text=f"Ответ от поддержки:\n\n{message.text}")
        await message.answer("Ответ отправлен пользователю.")
    except Exception as e:
        await message.answer("Ошибка при отправке ответа пользователю.")

    del current_reply_target[message.from_user.id]

@dp.message()
async def handle_message(message: types.Message, state: FSMContext):
    if message.from_user.id in SUPPORT_USER_IDS and current_reply_target.get(message.from_user.id):
        await handle_admin_reply(message)
        return

    current_state = await state.get_state()
    if current_state == SupportStates.waiting_for_message:
        await process_user_message(message, state)
        return

    if not message.text or message.text.startswith('/'):
        return

    user_id = message.from_user.id
    username = message.from_user.username or "Без имени"
    text = message.text

    try:
        await bot.send_message(
            chat_id=SUPPORT_CHAT_ID,
            text=f"Сообщение от пользователя @{username} (ID: {user_id}):\n\n{text}",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="Ответить пользователю", callback_data=f"reply_{user_id}")]
            ])
        )
        await message.answer("Ваше сообщение отправлено в поддержку. Ожидайте ответа.")
    except Exception as e:
        await message.answer("Произошла ошибка при отправке сообщения. Попробуйте позже.")

async def run_bot():
    try:
        await dp.start_polling(bot)
    except Exception as e:
        print(f"Ошибка запуска бота: {e}")

class Command(BaseCommand):
    help = 'Запускает Telegram бота поддержки'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Запуск Telegram бота поддержки...'))
        try:
            asyncio.run(run_bot())
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('Остановка бота...'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Ошибка: {e}'))

