# PostgreSQL в Docker для DBeaver

Запуск из этой папки:

```bash
docker compose up -d --build
```

Параметры подключения в DBeaver:

- Host: `localhost`
- Port: `5432`
- Database: `app_db`
- Username: `app`
- Password: `app_password`

Проверка состояния:

```bash
docker compose ps
docker compose logs -f postgres
```

Остановка контейнера без удаления данных:

```bash
docker compose down
```

Для полного удаления данных PostgreSQL:

```bash
docker compose down -v
```