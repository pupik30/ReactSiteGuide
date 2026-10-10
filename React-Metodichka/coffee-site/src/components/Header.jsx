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
