# Справочник команд Dockerfile

Полный список инструкций файла `Dockerfile` по [официальной документации](https://docs.docker.com/reference/dockerfile/).

Инструкции пишут заглавными буквами. Файл обычно называют `Dockerfile` без расширения.

## FROM

Базовый образ. С этой строки начинается каждый Dockerfile.

```dockerfile
FROM python:3.12-slim
```

Можно указать этап сборки: `FROM python:3.12-slim AS builder`.

## RUN

Команда **на этапе сборки**. Ставит пакеты, компилирует код.

```dockerfile
RUN javac HelloWorld.java
RUN apt-get update && apt-get install -y curl
```

## CMD

Команда по умолчанию **при старте контейнера**. Её можно переопределить в `docker run`.

```dockerfile
CMD ["python", "main.py"]
```

Если есть и `ENTRYPOINT`, и `CMD`, то `CMD` становится аргументами для `ENTRYPOINT`.

## LABEL

Метаданные образа: автор, версия, описание.

```dockerfile
LABEL maintainer="you@example.com"
LABEL version="1.0"
```

## MAINTAINER

Устарела. Раньше указывала автора образа. Сейчас вместо неё используют `LABEL`.

```dockerfile
MAINTAINER Name
```

## EXPOSE

Подсказка, какой порт слушает приложение. Сам порт наружу не открывает — для этого нужен `-p` у `docker run`.

```dockerfile
EXPOSE 3000
```

## ENV

Переменная окружения внутри образа и контейнера.

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
```

## ADD

Копирует файлы в образ, как `COPY`, но ещё умеет распаковывать архивы и скачивать по URL. Для обычных файлов лучше `COPY`.

```dockerfile
ADD app.tar.gz /app
```

## COPY

Копирует файлы с компьютера в образ. Предсказуемее, чем `ADD`.

```dockerfile
COPY main.py .
COPY . .
```

Первая точка — откуда, вторая — куда (текущий `WORKDIR`).

## ENTRYPOINT

Главная программа контейнера. Её сложнее переопределить, чем `CMD`. Часто ставят вместе: `ENTRYPOINT` — команда, `CMD` — аргументы по умолчанию.

```dockerfile
ENTRYPOINT ["python"]
CMD ["main.py"]
```

## VOLUME

Помечает папку как том: данные могут жить отдельно от контейнера.

```dockerfile
VOLUME /data
```

## USER

Пользователь, от имени которого идут следующие команды и запуск контейнера.

```dockerfile
USER node
```

По умолчанию часто `root`.

## WORKDIR

Рабочая папка внутри образа. Если каталога нет, Docker его создаст.

```dockerfile
WORKDIR /app
```

## ARG

Переменная только **на этапе сборки**. Задаётся через `--build-arg`. В работающем контейнере её уже нет (в отличие от `ENV`).

```dockerfile
ARG VERSION=3.12
FROM python:${VERSION}-slim
```

```bash
docker build --build-arg VERSION=3.14 -t my-image .
```

## ONBUILD

Инструкция, которая сработает позже — когда **другой** Dockerfile возьмёт этот образ как `FROM`.

```dockerfile
ONBUILD COPY . /app
```

В простых проектах почти не нужна.

## STOPSIGNAL

Какой сигнал послать контейнеру при `docker stop`. По умолчанию обычно `SIGTERM`.

```dockerfile
STOPSIGNAL SIGTERM
```

## HEALTHCHECK

Как Docker проверяет, что контейнер жив.

```dockerfile
HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000/ || exit 1
```

## SHELL

Какую оболочку использовать для команд в shell-форме (`RUN apt-get ...` без квадратных скобок).

```dockerfile
SHELL ["bash", "-c"]
```

По умолчанию в Linux это `/bin/sh`.
