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
