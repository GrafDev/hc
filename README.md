# Song Recommendation and Similarity Analysis App

Это веб-приложение предоставляет рекомендации песен и анализ их сходства, интегрируясь с API Spotify и включая серверную часть на основе Firebase Functions.

## Структура проекта

- `src/`: Директория исходного кода
  - `app/`: Основной код приложения
    - `providers/`: Компоненты-провайдеры
    - `entities/`: Определения сущностей и модели
    - `features/`: Реализации функциональностей
      - `calculateSimilarity/`: Логика расчета сходства
      - `songRecommendation/`: Функционал рекомендаций песен
    - `pages/`: Компоненты страниц
    - `shared/`: Общие утилиты и компоненты
  - `widgets/`: Переиспользуемые UI-компоненты
    - `ChooseQuantity/`: Компонент выбора количества
    - `PlayerHC/`: Компонент плеера Spotify
    - `SimilarityMap/`: Компонент визуализации сходства песен
    - `SongInfo/`: Компонент отображения информации о песне
    - `VisualizationControls/`: Элементы управления визуализацией

- `functions/`: Серверные функции Firebase
  - `src/`: Исходный код функций
    - `controllers/`: Обработчики запросов
    - `data/`: Файлы данных
    - `entities/`: Определения сущностей
    - `features/`: Реализации функциональностей
    - `routes/`: Определения API-маршрутов
    - `services/`: Сервисы бизнес-логики

## Ключевые функции

1. Расчет сходства песен
2. Рекомендации песен
3. Интеграция со Spotify
4. Визуализация данных (карта сходства)
5. Пользовательские UI-компоненты для плеера и отображения информации о песнях
6. API для обработки и предоставления данных
7. Парсинг CSV-данных о песнях Spotify

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- Chakra UI
- Framer Motion
- React Konva
- Spotify Web API JS
- Axios
- Papa Parse
- Firebase (клиентский SDK)

### Backend
- Node.js 18
- Express.js
- Firebase Functions
- Firebase Admin SDK
- CORS
- Papa Parse

## Установка и настройка

1. Клонируйте репозиторий
2. Установите зависимости для frontend и backend:npm install
cd functions && npm install
3. Настройте переменные окружения:
- Скопируйте `.env.local.example` в `.env.local` и заполните необходимые значения

## Запуск приложения

### Frontend 
npm run dev

## Сборка для production
### Frontend
npm run build
### Backend
Сборка не требуется для Firebase Functions.

## Развертывание

### Frontend

Разверните собранный frontend на выбранной платформе хостинга.

### Backend
cd functions
npm run deploy

Убедитесь, что у вас установлен Firebase CLI и вы вошли в свой аккаунт Firebase.

## Конфигурация прокси

Frontend настроен с прокси на `https://l24w629902.execute-api.eu-north-1.amazonaws.com`.

## Зависимости

Полный список зависимостей для frontend и backend можно найти в соответствующих файлах package.json.

## Скрипты

### Frontend
- `dev`: Запуск сервера разработки Vite
- `build`: Компиляция TypeScript и сборка Vite
- `lint`: Запуск ESLint
- `preview`: Предпросмотр production-сборки

### Backend
- `serve`: Запуск эмуляторов Firebase
- `shell`: Запуск оболочки Firebase Functions
- `start`: Алиас для `shell`
- `build`: Нет операции (заглушка)
- `deploy`: Развертывание функций в Firebase
- `logs`: Просмотр логов Firebase Functions
- `dev`: Запуск сервера разработки с Nodemon

## Интеграция со Spotify

Приложение интегрируется с Spotify Web Playback SDK. Файл типов `spotify.d.ts` обеспечивает поддержку TypeScript для объектов и интерфейсов Spotify.

### Ключевые интерфейсы и типы

- `Window`: Расширен свойствами, связанными со Spotify.
- `PlayerOptions`: Опции для инициализации плеера Spotify.
- `Spotify.Player`: Интерфейс для плеера Spotify Web Playback SDK.
- `Spotify.PlaybackState`: Представляет текущее состояние воспроизведения.
- `Spotify.Track`: Представляет трек Spotify.
- `Spotify.Artist`: Представляет исполнителя.
- `Spotify.Album`: Представляет альбом.
- `Spotify.Image`: Представляет изображение, связанное с альбомами или исполнителями.

