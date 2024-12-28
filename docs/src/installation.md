# Установка

Для установки выполните следующие шаги:

1. Клонируйте репозиторий:

   ```
   git clone https://github.com/VladimirRudenk0/areal-hr-test-2024.git
   ```

2. Перейдите в папку проекта:

   ```
   cd areal-hr-test-2024
   ```

3. Установите зависимости:

   ```
   npm install
   ```

4. Запустите сервер разработки:

   ```
   npm run dev
   ```

## Запуск проекта на Docker

1. Создайте контейнеры с помощью команды:

   ```
   docker-compose up --build
   ```

2. После создания контейнеров выполните миграцию для базы данных:

   ```
   docker-compose exec backend npx sequelize-cli db:migrate
   ```

## [Вернуться на главную страницу](index.md)