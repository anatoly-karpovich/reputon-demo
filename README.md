# 🧪 Reputon Demo — Playwright Test Framework

Автоматизация UI-тестов для Shopify-приложения с использованием [Playwright](https://playwright.dev), Allure-репортов и уведомлений в Telegram.

## 🚀 Возможности

- ✅ UI и интеграционные тесты с Playwright
- 📊 Allure-репорт
- 🔔 Уведомления в Telegram с итоговой статистикой
- 🏷️ Гибкая система тегов (`@ui`, `@api`, `@google_reviews` и т.д.)
- ⚙️ Удобная интеграция с CI

---

## 📦 Установка

```bash
git clone https://github.com/anatoly-karpovich/reputon-demo.git
cd reputon-demo
npm ci
```

---

## ⚙️ Конфигурация

Создай файл `.env` на основе `.env.dist`:

```bash
cp .env.dist .env
```

### Пример `.env`

```env
# Telegram bot token from BotFather for notifications
TELEGRAM_BOT_TOKEN=

# Telegram chat id for notifications
TELEGRAM_CHAT_ID=
```

---

## 🧪 Запуск тестов

```bash
npm run test:ui
```

Если нужен ручной запуск уведомлений:

```bash
npm run notify
```

---

## 📄 Отчёты

- 📂 HTML-репорт Playwright: `playwright-report/index.html`
- 🧾 Allure-репорт: `allure-report/index.html`
- 🧷 Кастомный JSON: `playwright-report/final-summary.json`

Генерация и просмотр Allure-репорта:

```bash
npm run allure-report
npm run allure-report-open
```

---

## 🔔 Telegram-уведомления

После прогона тестов можно отправить Telegram-уведомление, если заданы переменные в `.env`.

Сообщение содержит:

- Общую статистику (пройдено, упало и т.д.)
- Ссылку на Allure-репорт, развернутый на GitHub Pages
