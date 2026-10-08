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
