import espresso from '../assets/espresso.svg'
import latte from '../assets/latte.svg'
import cappuccino from '../assets/cappuccino.svg'

// Данные меню лежат отдельно от вёрстки. Захотел добавить напиток - добавь сюда объект.
export const menu = [
  { id: 1, name: 'Эспрессо', description: 'Крепкий, плотный, с густой пенкой.', price: 150, image: espresso },
  { id: 2, name: 'Латте', description: 'Нежный кофе с большим количеством молока.', price: 220, image: latte },
  { id: 3, name: 'Капучино', description: 'Классика: кофе, молоко и воздушная пена.', price: 200, image: cappuccino },
]
