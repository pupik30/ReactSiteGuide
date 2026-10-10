# Исправление прав PostgreSQL в Docker

Этот файл описывает исправление ошибок:

```text
ERROR: permission denied to create database
ERROR: permission denied for tablespace pg_default
```

## 1. Откройте терминал

В VS Code откройте меню **Terminal → New Terminal**.

Все команды ниже нужно выполнять в папке проекта:

```bash
cd /Users/macbokair/Desktop/db
```

Проверьте, что Docker Compose видит контейнер:

```bash
docker compose ps
```

Контейнер должен называться `postgres-db` и иметь статус `Up`.

## 2. Выдайте права пользователю `app`

Выполните эти команды в терминале VS Code или в обычном macOS Terminal:

```bash
docker compose exec -T postgres psql -U postgres -d postgres -c 'ALTER ROLE app CREATEDB;'
```

```bash
docker compose exec -T postgres psql -U postgres -d postgres -c 'GRANT CREATE ON TABLESPACE pg_default TO app;'
```

Первая команда разрешает пользователю `app` создавать базы данных.

Вторая команда разрешает использовать tablespace `pg_default` при создании баз данных.

Перезапуск Docker после этих команд не требуется.

## 3. Проверьте права

```bash
docker compose exec -T postgres psql -U postgres -d postgres -c '\du app'
```

В результате у роли `app` должен отображаться атрибут:

```text
Create DB
```

Проверка tablespace:

```bash
docker compose exec -T postgres psql -U postgres -d postgres -c "SELECT spcname, spcacl FROM pg_tablespace WHERE spcname = 'pg_default';"
```

В результате должна присутствовать запись с правом `C` для пользователя `app`.

## 4. Настройки подключения в DBeaver

Создайте или откройте подключение PostgreSQL со следующими параметрами:

| Поле | Значение |
|---|---|
| Host | `localhost` |
| Port | `5432` |
| Database | `app_db` или `postgres` |
| Username | `app` |
| Password | `app_password` |

После изменения прав нажмите в DBeaver **Disconnect**, затем **Connect**.

После повторного подключения попробуйте создать базу данных снова.

## 5. Проверка через терминал

Следующая команда создаёт тестовую базу от имени `app`:

```bash
docker compose exec -T postgres sh -c 'PGPASSWORD="$POSTGRES_PASSWORD" psql -h 127.0.0.1 -U "$POSTGRES_USER" -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE permission_check;"'
```

Если команда завершилась сообщением `CREATE DATABASE`, права настроены правильно.

Удалите тестовую базу:

```bash
docker compose exec -T postgres psql -U postgres -d postgres -c 'DROP DATABASE permission_check;'
```

## Важно

Не выполняйте команду ниже, если не хотите удалить все данные PostgreSQL:

```bash
docker compose down -v
```

Она удаляет Docker volume с базами данных.

Обычная остановка контейнера без удаления данных:

```bash
docker compose down
```

Запуск контейнера:

```bash
docker compose up -d
```

Скрипт `docker-entrypoint.sh` уже обновлён: при создании нового Docker volume пользователь `app` автоматически получает права `CREATEDB` и `CREATE` на `pg_default`.
