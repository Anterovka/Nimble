import asyncio
import os
from aiogram import Bot, Dispatcher, types
from aiogram.filters import Command
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

SUPPORT_CHAT_ID = '-1003279549896'
SUPPORT_USER_IDS = [8490807800]
storage = MemoryStorage()
bot = Bot(token="8570759967:AAGlp-BDexuQP2WMvWVuatszi9x9bY6oLQc") #ваш токен
dp = Dispatcher(storage=storage)

class SupportStates(StatesGroup):
    waiting_for_message = State()

current_reply_target = {}

@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    print(f"📨 Получена команда /start от пользователя {message.from_user.id}")
    welcome_text = (
        "👋 <b>Добро пожаловать!</b>\n\n"
        "🤖 Я бот поддержки сайта по созданию сайтов <b>Nimble</b>.\n"
        "Готов помочь вам с любыми вопросами!\n\n"
        "📋 <b>Доступные команды:</b>\n"
        "• /help — 📖 помощь и справка\n"
        "• /faq — ❓ часто задаваемые вопросы\n"
        "• /support — 💬 отправить сообщение в поддержку\n\n"
        "💡 Просто напишите мне, и я помогу вам!"
    )
    try:
        await message.answer(welcome_text, parse_mode="HTML")
        print(f"✅ Ответ отправлен пользователю {message.from_user.id}")
    except Exception as e:
        print(f"❌ Ошибка при отправке ответа: {e}")

@dp.message(Command("help"))
async def cmd_help(message: types.Message):
    help_text = (
        "🆘 <b>Справка по боту</b>\n\n"
        "📌 <b>Основные команды:</b>\n"
        "• /start — 🚀 начать общение с ботом\n"
        "• /help — 📖 эта справка\n"
        "• /faq — ❓ часто задаваемые вопросы\n"
        "• /support — 💬 написать в поддержку\n\n"
        "💬 <b>Как это работает:</b>\n"
        "Просто напишите мне ваш вопрос, и я перешлю его команде поддержки.\n"
        "Они обязательно ответят вам!\n\n"
        "✨ Если у вас есть вопрос, просто напишите его мне, и я постараюсь помочь!"
    )
    await message.answer(help_text, parse_mode="HTML")

# FAQ
@dp.message(Command("faq"))
async def cmd_faq(message: types.Message):
    faq_text = (
        "❓ <b>Часто задаваемые вопросы</b>\n\n"
        "1️⃣ <b>Как начать создание сайта?</b>\n"
        "   👉 Зайдите на сайт и зарегистрируйтесь.\n"
        "   👉 Выберите шаблон и начните редактировать.\n\n"
        "2️⃣ <b>Можно ли оплатить подписку позже?</b>\n"
        "   ✅ Да, вы можете использовать пробный период.\n\n"
        "3️⃣ <b>Поддерживаете ли вы домены?</b>\n"
        "   ✅ Да, вы можете подключить свой домен в настройках сайта.\n\n"
        "💡 <b>Не нашли ответ?</b> Напишите нам через /support!"
    )
    await message.answer(faq_text, parse_mode="HTML")

@dp.message(Command("support"))
async def cmd_support(message: types.Message, state: FSMContext):
    await state.set_state(SupportStates.waiting_for_message)
    await message.answer(
        "💬 <b>Отправка сообщения в поддержку</b>\n\n"
        "✍️ Теперь напишите ваше сообщение, и я перешлю его команде поддержки.\n\n"
        "⏳ Они обязательно ответят вам в ближайшее время!\n\n"
        "❌ Для отмены напишите: /cancel",
        parse_mode="HTML"
    )

@dp.message(SupportStates.waiting_for_message)
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
        await message.answer(
            "✅ <b>Сообщение отправлено!</b>\n\n"
            "📨 Ваше сообщение успешно переслано в поддержку.\n"
            "⏳ Ожидайте ответа от нашей команды.\n\n"
            "💬 Они свяжутся с вами в ближайшее время!",
            parse_mode="HTML"
        )
        await state.clear()  # Сбрасываем состояние после отправки
    except Exception as e:
        await message.answer(
            f"❌ <b>Ошибка при отправке</b>\n\n"
            f"Произошла ошибка: {str(e)}\n\n"
            f"🔄 Попробуйте позже или обратитесь к администратору.",
            parse_mode="HTML"
        )
        await state.clear()

@dp.callback_query(lambda c: c.data.startswith("reply_"))
async def process_callback_reply(callback_query: types.CallbackQuery):
    if callback_query.from_user.id not in SUPPORT_USER_IDS:
        await callback_query.answer("❌ У вас нет прав для ответа пользователям.", show_alert=True)
        return
    
    user_id = int(callback_query.data.split("_")[1])
    await callback_query.answer("✅ Режим ответа активирован! Напишите ответ в личном чате с ботом.")
    
    current_reply_target[callback_query.from_user.id] = user_id

    try:
        await bot.send_message(
            chat_id=callback_query.from_user.id,
            text=f"✉️ Введите ваш ответ пользователю с ID: {user_id}.\n\n"
                 f"Ваше следующее сообщение будет отправлено этому пользователю."
        )
    except Exception as e:
        print(f"❌ Ошибка отправки инструкции администратору: {e}")

@dp.message(lambda m: m.from_user.id in SUPPORT_USER_IDS and m.text and current_reply_target.get(m.from_user.id))
async def handle_admin_reply(message: types.Message):
    #ответ от администратора
    target_user_id = current_reply_target[message.from_user.id]
    
    #Проверка
    
    if message.text.lower() in ['/cancel', 'отмена', 'cancel']:
        del current_reply_target[message.from_user.id]
        await message.answer("❌ <b>Ответ отменен</b>\n\nРежим ответа деактивирован.", parse_mode="HTML")
        return
    
    try:
        #ответ пользователю
        await bot.send_message(
            chat_id=target_user_id, 
            text=f"💬 <b>Ответ от поддержки</b>\n\n{message.text}",
            parse_mode="HTML"
        )
        await message.answer(
            f"✅ <b>Ответ успешно отправлен!</b>\n\n"
            f"👤 Пользователю: <code>{target_user_id}</code>\n"
            f"📝 Ваш ответ: {message.text[:30]}{'...' if len(message.text) > 30 else ''}",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.answer(f"❌ Ошибка при отправке ответа пользователю: {str(e)}")
    del current_reply_target[message.from_user.id]

@dp.message()
async def handle_message(message: types.Message):
    if message.from_user.id in SUPPORT_USER_IDS and current_reply_target.get(message.from_user.id):
        await handle_admin_reply(message)
        return

    if message.from_user.id in SUPPORT_USER_IDS:
        if not current_reply_target.get(message.from_user.id):
            await message.answer(
                "👋 <b>Привет, администратор!</b>\n\n"
                "📋 <b>Как ответить пользователю:</b>\n"
                "1️⃣ Перейдите в группу поддержки\n"
                "2️⃣ Нажмите кнопку '💬 Ответить пользователю' под сообщением\n"
                "3️⃣ Затем напишите ответ здесь\n\n"
                "💡 Ваши сообщения в личном чате НЕ пересылаются в группу.",
                parse_mode="HTML"
            )
        return

    if not message.text:
        await message.answer(
            "⚠️ Пожалуйста, отправьте текстовое сообщение.\n\n"
            "💬 Я могу обработать только текстовые сообщения.",
            parse_mode="HTML"
        )
        return

    user_id = message.from_user.id
    username = message.from_user.username or "Без имени"
    text = message.text

    try:
        await bot.send_message(
            chat_id=SUPPORT_CHAT_ID,
            text=f"📩 <b>Новое сообщение от пользователя</b>\n\n"
                 f"👤 <b>Пользователь:</b> @{username}\n"
                 f"🆔 <b>ID:</b> {user_id}\n\n"
                 f"💬 <b>Сообщение:</b>\n{text}",
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup(inline_keyboard=[
                [InlineKeyboardButton(text="💬 Ответить пользователю", callback_data=f"reply_{user_id}")]
            ])
        )
        await message.answer(
            "✅ <b>Сообщение отправлено!</b>\n\n"
            "📨 Ваше сообщение успешно переслано в поддержку.\n"
            "⏳ Ожидайте ответа от нашей команды.\n\n"
            "💬 Они свяжутся с вами в ближайшее время!",
            parse_mode="HTML"
        )
    except Exception as e:
        await message.answer(
            f"❌ <b>Ошибка при отправке</b>\n\n"
            f"Произошла ошибка: {str(e)}\n\n"
            f"🔄 Попробуйте позже или обратитесь к администратору.",
            parse_mode="HTML"
        )

# Запуск бота
async def start_bot():
    print("=" * 50)
    print("🚀 Бот запускается...")
    print("=" * 50)
    try:
        print("\n" + "=" * 50)
        print("📡 Бот готов к работе. Ожидание сообщений...")
        print("   Нажмите Ctrl+C для остановки")
        print("=" * 50 + "\n")
        
        await dp.start_polling(bot, skip_updates=True, allowed_updates=["message", "callback_query"])
    except Exception as e:
        print("\n" + "=" * 50)
        print(f"❌ ОШИБКА при запуске бота: {e}")
        print("=" * 50)
        print("\nВозможные причины:")
        print("1. Неверный токен бота")
        print("2. Проблемы с интернет-соединением")
        print("3. Telegram API недоступен")
        print("4. Конфликт версий библиотек")
        import traceback
        print("\nДетали ошибки:")
        traceback.print_exc()
    finally:
        try:
            await bot.session.close()
        except:
            pass

