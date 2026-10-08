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
