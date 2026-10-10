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
