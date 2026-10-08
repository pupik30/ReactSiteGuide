# 4. Создание и правка первой страницы

Здесь мы пишем сам сайт. Идём от простого к сложному: сначала обычные теги в одном файле, потом делим на компоненты, потом красим, потом оживляем кнопку.

Работайте в своём проекте `my-site`, который вы создали в разделе 3. Сервер должен быть запущен (`npm run dev`), страница открыта в браузере. Каждый раз после `Ctrl + S` она обновится сама, перезагружать не нужно.

Если что-то не получается, сравнивайте со своей копией в папке `coffee-site` из архива.

## Шаг 1. Убираем лишнее из шаблона

Vite кладёт в проект стартовую страницу с логотипами. Нам она не нужна.

1. В папке `src` удалите файлы `App.css` и `index.css`, а также папку `assets` со всем содержимым.
2. Создайте пустые файлы `src/index.scss` и `src/App.scss`.
3. Скопируйте из архива папку `coffee-site/src/assets` в свой `src`. Там лежат наши картинки: логотип, чашка для главного экрана и три напитка. Все они в формате SVG, это векторные рисунки, они не теряют качества при увеличении.
4. Замените содержимое `src/main.jsx` на это:

Файл `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.jsx'

// Находим <div id="root"> из index.html и рисуем в нём наш компонент App
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Что здесь происходит. Строка `import './index.scss'` подключает файл со стилями ко всему сайту. `createRoot(...)` находит в `index.html` блок `<div id="root">` и говорит: «рисуй сюда компонент `App`». `StrictMode` это обёртка, которая в режиме разработки подсвечивает возможные ошибки, на готовый сайт не влияет.

Также откройте `index.html` и поменяйте текст внутри `<title>` на название вашего сайта. Это то, что видно на вкладке браузера.

## Шаг 2. Базовые теги

Откройте `src/App.jsx` и замените всё содержимое на этот простой вариант. Пока без компонентов и стилей, просто чтобы познакомиться с тегами:

```jsx
function App() {
  return (
    <div>
      <header>
        <h2>Зерно</h2>
        <nav>
          <a href="#menu">Меню</a>
        </nav>
      </header>

      <main>
        <section>
          <h1>Кофе, который хочется выпить медленно</h1>
          <p>Обжариваем зерно сами и варим каждую чашку вручную.</p>
          <button>Смотреть меню</button>
        </section>

        <section id="menu">
          <h2>Меню</h2>
          <div>
            <img src="/vite.svg" alt="Логотип Vite" width="80" />
            <p>Эспрессо, 150 ₽</p>
          </div>
        </section>
      </main>

      <footer>
        <p>Кофейня «Зерно»</p>
      </footer>
    </div>
  )
}

export default App
```

Сохраните и посмотрите в браузер: появился простой текст. Теперь разберём, что за теги тут написаны. Все они из обычного HTML, React их не меняет.

- `div` безликая коробка. Нужна, чтобы объединить несколько элементов в одну группу, чтобы потом их можно было красить или раскладывать.
- `header` шапка сайта: логотип, меню.
- `nav` блок навигации, ссылки на разделы.
- `a` ссылка. В `href` пишется адрес. `#menu` означает «перейти к элементу с `id="menu"` на этой же странице».
- `main` главное содержимое страницы. На странице он один.
- `section` смысловой раздел внутри страницы: «о нас», «меню» и так далее. Обычно начинается с заголовка.
- `h1`, `h2`, `h3` заголовки. `h1` главный, на странице он один, остальные меньше по значимости.
- `p` абзац текста.
- `img` картинка. `src` это путь к файлу, `alt` описание на случай, если картинка не загрузится, и для программ чтения с экрана.
- `button` кнопка.
- `ul` и `li` маркированный список и его пункты.
- `footer` подвал сайта: контакты, права.

## Шаг 3. Чем JSX отличается от HTML

То, что мы пишем внутри `return (...)`, называется JSX. Это HTML-подобная запись прямо внутри JavaScript. У неё несколько правил, на которых новички чаще всего ошибаются.

1. **Один корневой элемент.** Из компонента можно вернуть только один внешний тег. Если у вас рядом лежат два тега, оберните их в `div` или в пустой `<>...</>`.
2. **Вместо `class` пишем `className`.** Слово `class` в JavaScript занято, поэтому в JSX используется `className`.
3. **Теги без содержимого закрываем.** Было `<img src="a.png">`, станет `<img src="a.png" />`. С `<input>` и `<br>` так же.
4. **Фигурные скобки открывают JavaScript.** Внутри `{ }` можно писать значения и выражения: `<p>Корзина: {cart}</p>` покажет значение переменной `cart`.
5. **Названия компонентов с большой буквы.** `<Header />` это компонент, `<header>` обычный тег.
6. **Атрибуты в camelCase.** Например `onClick`, а не `onclick`.

## Шаг 4. Стили через SCSS

SCSS это CSS с приятными дополнениями. Нам нужны три:

- **Переменные.** Один раз записали цвет и пользуемся везде.
- **Вложенность.** Стили внутри стилей, не надо повторять длинные названия.
- **Подключение других файлов** через `@use`.

Создайте папку `src/styles` и в ней файл `_variables.scss` (подчёркивание в начале обязательно, оно говорит, что это вспомогательный файл):

Файл `src/styles/_variables.scss`:

```scss
// Переменные сайта. Меняешь цвет здесь - он меняется везде.
$color-bg: #fbf6ef;
$color-dark: #3b2418;
$color-accent: #c47a2c;
$color-accent-hover: #a8661f;
$color-card: #ffffff;
$color-text: #4a3a30;
$color-muted: #8a7768;

$radius: 16px;
$container: 1100px;
```

Теперь общие стили всего сайта. Вставьте это в `src/index.scss`:

Файл `src/index.scss`:

```scss
@use './styles/variables' as *;

// Глобальные стили: действуют на весь сайт
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Roboto, Arial, sans-serif;
  background: $color-bg;
  color: $color-text;
  line-height: 1.6;
}

img {
  max-width: 100%;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

// Класс-обёртка, чтобы содержимое не растягивалось на весь экран
.container {
  width: min(100% - 40px, $container);
  margin-inline: auto;
}

.btn {
  display: inline-block;
  padding: 12px 26px;
  border: none;
  border-radius: 999px;
  background: $color-accent;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: $color-accent-hover;
    transform: translateY(-2px);
  }
}

.section-title {
  font-size: 2rem;
  color: $color-dark;
  text-align: center;
  margin-bottom: 40px;
}
```

Разберём главное:

- Строка `@use './styles/variables' as *;` подключает наши переменные, после неё можно писать `$color-bg`.
- Блок с `*` сбрасывает стандартные отступы браузера, а `box-sizing: border-box` делает так, что ширина элемента включает его отступы. С этим проще считать размеры.
- В `.btn` есть вложенность: `&:hover` внутри означает «то же самое, но при наведении мыши». Без SCSS пришлось бы писать отдельное правило `.btn:hover`.
- Класс `.container` ограничивает ширину содержимого и центрирует его. Мы будем класть его внутрь каждой секции.

В файле `src/App.scss` поставьте такое:

Файл `src/App.scss`:

```scss
// Стили самого корневого компонента. Сейчас нужен только отступ,
// чтобы страница не была короче экрана.
.app {
  min-height: 100vh;
}

html {
  scroll-behavior: smooth;
}
```

### Как называть классы

Мы называем классы по простой схеме: `блок__элемент`. Например `header__logo` это логотип внутри шапки, а `menu__card` карточка внутри меню. Двойное подчёркивание это просто договорённость, чтобы названия не путались между разными частями сайта. В SCSS это удобно пишется через `&__`:

```scss
.header {
  background: #3b2418;

  &__logo {      // станет .header__logo
    font-size: 1.3rem;
  }
}
```

## Шаг 5. Делим сайт на компоненты

Сейчас весь сайт сидит в одном файле. Когда он вырастет, в нём станет невозможно разобраться. Поэтому каждый смысловой кусок выносим в отдельный компонент: шапка, главный экран, блок «о нас», меню, подвал.

Компонент в React это обычная функция, которая возвращает JSX. Имя функции пишется с большой буквы, а в конце файла стоит `export default`, чтобы другие файлы могли её подключить.

Создайте папку `src/components`. Каждому компоненту делаем два файла: `.jsx` с разметкой и `.scss` со стилями.

### Header: шапка

Здесь новое понятие: **props** (свойства). Это параметры, которые родитель передаёт компоненту, как аргументы функции. `Header` получает число `cart` и показывает его.

Файл `src/components/Header.jsx`:

```jsx
import './Header.scss'
import logo from '../assets/logo.svg'

// props: cart - число товаров в корзине (приходит из App)
function Header({ cart }) {
  return (
    <header className="header">
      <div className="container header__inner">
        <a href="#top" className="header__logo">
          <img src={logo} alt="Логотип Зерно" width="36" height="36" />
          <span>Зерно</span>
        </a>

        <nav className="header__nav">
          <a href="#about">О нас</a>
          <a href="#menu">Меню</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div className="header__cart">Корзина: {cart}</div>
      </div>
    </header>
  )
}

export default Header
```

Файл `src/components/Header.scss`:

```scss
@use '../styles/variables' as *;

.header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: $color-dark;
  color: #fff;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding-block: 14px;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.3rem;
    font-weight: 700;
  }

  &__nav {
    display: flex;
    gap: 28px;

    a:hover {
      color: $color-accent;
    }
  }

  &__cart {
    padding: 6px 14px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    font-size: 0.95rem;
  }
}

@media (max-width: 640px) {
  .header__nav {
    display: none;
  }
}
```

Обратите внимание: `{ cart }` в круглых скобках функции это тот самый props. А `{cart}` внутри разметки выводит его значение на страницу.

Картинку мы подключили через `import logo from '../assets/logo.svg'`. Так в React принято: картинка импортируется как переменная и вставляется в `src={logo}`. Пути `../` означают «подняться на папку выше».

### Hero: главный экран

Файл `src/components/Hero.jsx`:

```jsx
import './Hero.scss'
import cup from '../assets/hero-cup.svg'

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1>Кофе, который хочется выпить медленно</h1>
          <p>
            Обжариваем зерно сами и варим каждую чашку вручную. Заходи на
            утренний эспрессо или вечерний латте.
          </p>
          <a href="#menu" className="btn">
            Смотреть меню
          </a>
        </div>
        <img className="hero__img" src={cup} alt="Чашка кофе" />
      </div>
    </section>
  )
}

export default Hero
```

Файл `src/components/Hero.scss`:

```scss
@use '../styles/variables' as *;

.hero {
  padding-block: 80px;

  &__inner {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    gap: 40px;
  }

  &__text {
    h1 {
      font-size: 2.8rem;
      line-height: 1.15;
      color: $color-dark;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.1rem;
      color: $color-muted;
      margin-bottom: 30px;
    }
  }

  &__img {
    width: 100%;
    max-width: 420px;
    border-radius: $radius;
    margin-inline: auto;
  }
}

@media (max-width: 800px) {
  .hero__inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
```

Про вёрстку тут стоит запомнить `display: grid; grid-template-columns: 1fr 1fr;`. Это сетка в две равные колонки: слева текст, справа картинка. А блок `@media (max-width: 800px)` переключает на одну колонку на узких экранах, например на телефоне.

### About: три карточки

Тут мы впервые показываем **список**. Данные лежат в обычном массиве, а `map` превращает каждый элемент массива в кусочек разметки.

Файл `src/components/About.jsx`:

```jsx
import './About.scss'

// Обычный массив данных. React превратит его в карточки через map
const features = [
  { id: 1, title: 'Свежая обжарка', text: 'Зерно обжариваем каждую неделю маленькими партиями.' },
  { id: 2, title: 'Ручная варка', text: 'Бариста готовит каждую чашку отдельно, без автоматов.' },
  { id: 3, title: 'Уютно', text: 'Тихая музыка, розетки у каждого стола и бесплатный Wi-Fi.' },
]

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <h2 className="section-title">Почему к нам возвращаются</h2>

        <div className="about__list">
          {features.map((item) => (
            <div className="about__card" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
```

Файл `src/components/About.scss`:

```scss
@use '../styles/variables' as *;

.about {
  padding-block: 60px;

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &__card {
    padding: 28px;
    background: $color-card;
    border-radius: $radius;
    box-shadow: 0 6px 20px rgba(59, 36, 24, 0.08);

    h3 {
      color: $color-accent;
      margin-bottom: 10px;
    }
  }
}

@media (max-width: 800px) {
  .about__list {
    grid-template-columns: 1fr;
  }
}
```

Про `key={item.id}`: когда React рисует список, ему нужен уникальный ярлык на каждый элемент, чтобы понимать, что именно поменялось. Если его забыть, в консоли браузера будет предупреждение. В качестве `key` берут `id`, а не порядковый номер.

### Данные для меню

Вынесем напитки в отдельный файл, чтобы не смешивать данные и разметку. Создайте папку `src/data`:

Файл `src/data/menu.js`:

```js
import espresso from '../assets/espresso.svg'
import latte from '../assets/latte.svg'
import cappuccino from '../assets/cappuccino.svg'

// Данные меню лежат отдельно от вёрстки. Захотел добавить напиток - добавь сюда объект.
export const menu = [
  { id: 1, name: 'Эспрессо', description: 'Крепкий, плотный, с густой пенкой.', price: 150, image: espresso },
  { id: 2, name: 'Латте', description: 'Нежный кофе с большим количеством молока.', price: 220, image: latte },
  { id: 3, name: 'Капучино', description: 'Классика: кофе, молоко и воздушная пена.', price: 200, image: cappuccino },
]
```

Захотите добавить новый напиток: положите картинку в `assets`, импортируйте её и допишите объект в массив. Больше ничего менять не нужно, карточка появится сама.

### Menu: карточки напитков

У кнопки есть событие `onClick`. Мы не знаем, что делать при нажатии, это решает родитель, поэтому он передаёт нам функцию `onAdd`, а мы её вызываем.

Файл `src/components/Menu.jsx`:

```jsx
import './Menu.scss'
import { menu } from '../data/menu.js'

// props: onAdd - функция, которую мы вызываем при нажатии на кнопку
function Menu({ onAdd }) {
  return (
    <section className="menu" id="menu">
      <div className="container">
        <h2 className="section-title">Меню</h2>

        <div className="menu__list">
          {menu.map((item) => (
            <article className="menu__card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="menu__body">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <div className="menu__bottom">
                  <span className="menu__price">{item.price} ₽</span>
                  <button className="btn" onClick={onAdd}>
                    В корзину
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu
```

Файл `src/components/Menu.scss`:

```scss
@use '../styles/variables' as *;

.menu {
  padding-block: 60px;

  &__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  &__card {
    background: $color-card;
    border-radius: $radius;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 6px 20px rgba(59, 36, 24, 0.08);

    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 20px;

    h3 {
      color: $color-dark;
    }

    p {
      color: $color-muted;
      font-size: 0.95rem;
      margin-block: 6px 16px;
    }
  }

  &__bottom {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__price {
    font-size: 1.2rem;
    font-weight: 700;
    color: $color-dark;
  }
}

@media (max-width: 800px) {
  .menu__list {
    grid-template-columns: 1fr;
  }
}
```

### Footer: подвал

Файл `src/components/Footer.jsx`:

```jsx
import './Footer.scss'

function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="container">
        <p>Кофейня «Зерно» · ул. Примерная, 12 · ежедневно с 8:00 до 22:00</p>
        <p className="footer__small">Учебный проект на React</p>
      </div>
    </footer>
  )
}

export default Footer
```

Файл `src/components/Footer.scss`:

```scss
@use '../styles/variables' as *;

.footer {
  margin-top: 60px;
  padding-block: 40px;
  background: $color-dark;
  color: #e9dccd;
  text-align: center;

  &__small {
    margin-top: 6px;
    font-size: 0.85rem;
    opacity: 0.6;
  }
}
```

## Шаг 6. Собираем всё в App и оживляем кнопку

Остался главный файл. Здесь мы подключаем все компоненты и знакомимся с **состоянием**.

Обычная переменная в компоненте не умеет обновлять страницу. Если написать `let cart = 0` и увеличивать её, на экране ничего не изменится. Для этого в React есть `useState`:

- `cart` текущее значение.
- `setCart` функция, которой это значение меняют.
- `useState(0)` говорит, что начальное значение ноль.

Каждый раз, когда вызывается `setCart(...)`, React сам перерисовывает всё, что зависит от `cart`.

Файл `src/App.jsx`:

```jsx
import { useState } from 'react'
import './App.scss'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Menu from './components/Menu.jsx'
import Footer from './components/Footer.jsx'

function App() {
  // cart - текущее значение, setCart - функция, которая его меняет
  const [cart, setCart] = useState(0)

  const addToCart = () => setCart(cart + 1)

  return (
    <div className="app">
      <Header cart={cart} />
      <main>
        <Hero />
        <About />
        <Menu onAdd={addToCart} />
      </main>
      <Footer />
    </div>
  )
}

export default App
```

Как это работает вместе. `App` хранит число `cart`. Шапке он отдаёт его, чтобы она показала. Меню он отдаёт функцию `addToCart`. Когда вы жмёте «В корзину», меню вызывает эту функцию, состояние растёт, и React перерисовывает шапку с новым числом. Состояние лежит в `App` потому, что оно нужно сразу двум соседям, шапке и меню. Данные в React всегда передаются вниз, от родителя к детям.

Теперь сохраните всё (`Ctrl + S`) и посмотрите в браузер. Должен получиться сайт как на картинке в начале. Нажмите на кнопку несколько раз, число в углу шапки должно расти. Попробуйте ссылки в шапке, они плавно прокручивают страницу к нужному разделу.

## Шаг 7. Если что-то сломалось

- **Белый экран.** Откройте терминал, где запущен `npm run dev`: там написана ошибка и строка, где она случилась. Чаще всего это забытая закрывающая скобка или тег.
- **Ошибка «Failed to resolve import».** Неверный путь в `import`. Проверьте название файла и регистр букв, а также `../` или `./`.
- **Нет стилей.** Проверьте, что в `.jsx` файле есть строка `import './Название.scss'`, и что пакет `sass` установлен (`npm install -D sass`).
- **Не видны изменения.** Вы не сохранили файл. Или сервер остановлен, тогда снова `npm run dev`.
- **Предупреждение про `key`.** Забыли `key` у элемента внутри `map`.

## Что попробовать самим

Лучший способ запомнить: поменять что-нибудь в готовом.

1. Поменяйте цвета в `_variables.scss` и посмотрите, как перекрасится весь сайт.
2. Добавьте четвёртый напиток в `data/menu.js`.
3. Добавьте в `About.jsx` четвёртую карточку.
4. Придумайте свою тему (магазин, портфолио, блог) и замените тексты и картинки.

Дальше: [GitHub](05-github.md).
