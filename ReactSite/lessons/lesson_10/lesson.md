# Урок 10. Проект Django с PostgreSQL и Nginx

Ролик: [#10. Проект Django с PostgreSQL и Nginx](https://rutube.ru/video/0c766a3ce54665a820a076b6ebd11330/)
Плейлист: [Docker для начинающих](https://rutube.ru/plst/859340/)

> Материал развивает тему указанного ролика и исходный план лекции. Полная расшифровка видео при подготовке недоступна; примеры ниже — самостоятельная практика, а не дословное воспроизведение действий автора. Справочные ссылки приведены в конце.

В [уроке 9](../lesson_9/lesson.md) вы познакомились с Docker Compose. В этом уроке соберём микросервисное приложение: сайт на Django, базу PostgreSQL и сервер Nginx.

Цель урока — собрать отдельный учебный стек Django, PostgreSQL и Nginx, выполнить миграции и проверить сохранение данных.

Перед началом запустите Docker Desktop (на Linux — Docker Engine) и проверьте:

```bash
docker version
```

В выводе должны быть блоки `Client` и `Server`. Все примеры рассчитаны на Linux-контейнеры.

## Структура проекта

В качестве самостоятельной практики по теме ролика создадим небольшой сайт. Django обрабатывает запрос, PostgreSQL хранит данные, Nginx принимает HTTP-запросы от браузера. Для запуска Django используем Gunicorn.

Все файлы создаём в `lessons/lesson_10`. Существующая папка `lessons/db` не участвует в этом примере. У стека будет собственный проект Compose и собственный том.

```text
lesson_10/
├── lesson.md
├── docker-compose.yml
├── nginx.conf
└── web/
    ├── Dockerfile
    ├── .dockerignore
    ├── requirements.txt
    ├── manage.py
    └── config/
        ├── __init__.py
        ├── settings.py
        ├── urls.py
        └── wsgi.py
```

Ниже приведено полное содержимое минимального проекта. Устанавливать Python и PostgreSQL на хост не требуется.

## Сервис Django

Создайте `web/requirements.txt`:

```text
Django>=5.2,<5.3
psycopg[binary]>=3.2,<4
gunicorn>=23,<24
```

Диапазоны позволяют получать обновления в указанных ветках; сборки в разные даты могут установить разные версии. Для строго воспроизводимой поставки нужен файл с зафиксированными версиями всех зависимостей.

Файл `web/Dockerfile`:

```dockerfile
FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--access-logfile", "-"]
```

В `web/.dockerignore`:

```text
__pycache__
*.pyc
.venv
.env
```

В `web/manage.py`:

```python
import os
import sys
from django.core.management import execute_from_command_line

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    execute_from_command_line(sys.argv)
```

Создайте пустой `web/config/__init__.py`. Затем `web/config/settings.py`:

```python
import os

SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = False
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "web"]
ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
]
MIDDLEWARE = ["django.middleware.common.CommonMiddleware"]
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["POSTGRES_DB"],
        "USER": os.environ["POSTGRES_USER"],
        "PASSWORD": os.environ["POSTGRES_PASSWORD"],
        "HOST": "postgres",
        "PORT": "5432",
    }
}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
USE_TZ = True
LANGUAGE_CODE = "ru-ru"
```

`HOST` — имя сервиса PostgreSQL в Compose, а не `localhost`. Учётные данные поступят через окружение. В проекте оставлены только необходимые приложения; админка, статика и загрузка пользовательских файлов здесь не настраиваются.

В `web/config/urls.py`:

```python
from django.db import connection
from django.http import JsonResponse
from django.urls import path


def index(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
        result = cursor.fetchone()[0]
    return JsonResponse({"message": "Hello from Django", "database": result})


urlpatterns = [path("", index)]
```

Запрос `SELECT 1` позволяет проверить всю цепочку до базы, а не только появление страницы.

В `web/config/wsgi.py`:

```python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
application = get_wsgi_application()
```

## PostgreSQL и том для данных

Используем `postgres:17-alpine` с каталогом данных `/var/lib/postgresql/data`. Именованный том `pgdata` сохранит файлы после пересоздания контейнера. Не меняйте основную версию PostgreSQL на существующем томе без процедуры обновления базы.

Переменные `POSTGRES_DB`, `POSTGRES_USER` и `POSTGRES_PASSWORD` инициализируют **пустой** каталог данных. Изменение этих значений в YAML не переименует существующую базу и не поменяет пароль в уже созданной базе.

Порт `5432` на хост не публикуем: Django обращается к PostgreSQL по внутренней сети. Никакие файлы или тома существующего проекта `lessons/db` не подключаются.

## Nginx

Создайте `nginx.conf`:

```nginx
server {
    listen 80;
    location / {
        proxy_pass http://web:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Nginx передаёт запрос Gunicorn по имени `web`. Django использует драйвер `psycopg`, чтобы обратиться к `postgres`.

```text
браузер → localhost:8090 → Nginx:80 → Django/Gunicorn:8000 → PostgreSQL:5432
```

## Compose: запуск всего стека

Создайте `docker-compose.yml`:

```yaml
name: docker-lesson10

services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_DB: lesson10
      POSTGRES_USER: lesson10
      POSTGRES_PASSWORD: lesson10-local-only
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U lesson10 -d lesson10"]
      interval: 5s
      timeout: 3s
      retries: 20
      start_period: 10s

  web:
    build: ./web
    environment:
      DJANGO_SECRET_KEY: lesson10-local-demo-key-not-for-production
      POSTGRES_DB: lesson10
      POSTGRES_USER: lesson10
      POSTGRES_PASSWORD: lesson10-local-only
    depends_on:
      postgres:
        condition: service_healthy
    command:
      - sh
      - -c
      - python manage.py migrate --noinput && exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --access-logfile -
    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/', timeout=2)"]
      interval: 5s
      timeout: 3s
      retries: 20
      start_period: 20s

  nginx:
    image: nginx:stable-alpine
    ports:
      - "127.0.0.1:8090:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      web:
        condition: service_healthy

volumes:
  pgdata:
```

Пароль и ключ здесь открытые учебные значения только для локального примера. Для реального развёртывания задайте свои секреты вне репозитория и отдельно настройте HTTPS и параметры безопасности.

Сначала Compose ждёт готовности PostgreSQL, затем запускает миграции и Gunicorn. `&&` не даёт запустить сервер при неуспешной миграции. `exec` передаёт Gunicorn роль основного процесса, чтобы он получал сигналы остановки. Nginx запускается после успешной HTTP-проверки Django. Это последовательность для одного учебного экземпляра; в большом развёртывании миграции обычно выполняют отдельным шагом.

Из `lessons/lesson_10` выполните:

```bash
docker compose config
docker compose up -d --build
docker compose ps
docker compose logs --tail 30 web
```

Первый запуск требует времени на скачивание образов, установку пакетов и создание базы. Откройте [сайт](http://localhost:8090). Ожидается JSON:

```json
{"message": "Hello from Django", "database": 1}
```

Проверьте настройки проекта и миграции:

```bash
docker compose exec web python manage.py check
docker compose exec web python manage.py showmigrations
```

У применённых миграций будет отметка `[X]`.

## Практика

1. Создайте файлы проекта, выполните `config` и запустите стек.
2. Проверьте JSON в браузере: `database: 1` означает успешный запрос к PostgreSQL.
3. Создайте тестовую запись в учебной базе:

```bash
docker compose exec postgres psql -U lesson10 -d lesson10 -c "CREATE TABLE IF NOT EXISTS lesson_notes (id integer PRIMARY KEY, message text NOT NULL); INSERT INTO lesson_notes VALUES (1, 'Data survives container removal') ON CONFLICT (id) DO NOTHING;"
```

4. Пересоздайте контейнеры без удаления тома:

```bash
docker compose down
docker compose up -d
```

5. После готовности сервисов прочитайте запись:

```bash
docker compose exec postgres psql -U lesson10 -d lesson10 -c "SELECT * FROM lesson_notes;"
```

Строка должна остаться. Это проверка сохранности пользовательских данных, а не только автоматического повторного создания схемы миграциями.

6. Завершите работу через `docker compose down`. Учебный том останется. `down -v` удалил бы его с данными, поэтому для обычной остановки эту опцию не используем.

Если проект не запускается, начните с `docker compose ps -a` и `docker compose logs --tail 50`. Ошибка соединения с базой требует проверки `HOST`, пароля и состояния PostgreSQL. При `DisallowedHost` проверьте адрес браузера и `ALLOWED_HOSTS`. При `502` проверьте журнал `web`; после отдельного пересоздания `web` может потребоваться `docker compose restart nginx` для обновления адреса upstream.

## Кратко

- Django, PostgreSQL и Nginx выполняют разные задачи в отдельных контейнерах.
- Имена сервисов используются как адреса во внутренней сети.
- Миграции создают схему, том сохраняет данные, healthcheck проверяет готовность.
- На хост достаточно опубликовать только порт Nginx.

## Дополнительные материалы

- [Настройки Django](https://docs.djangoproject.com/en/5.2/ref/settings/)
- [Django и Gunicorn](https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/gunicorn/)
- [Официальный образ PostgreSQL](https://hub.docker.com/_/postgres)
- [Готовность сервисов Compose](https://docs.docker.com/compose/how-tos/startup-order/)
