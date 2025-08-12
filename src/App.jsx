import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import Home from './pages/Home/Home'
import BannerSlider from './component/slider/BannerSlider '
import { ImageSlides } from './utils/TextConstants'
import AnimeCard from './component/card/AnimeCard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Home />
      <BannerSlider slides={ImageSlides} />
      <AnimeCard
        image="https://i.ibb.co/DzKZ6JH/danmachi.jpg"
        title="Dungeon ni Deai wo Motomeru no wa Machigatteiru Darou ka II"
        rating={4.5}
      />
      <AnimeCard
        image="https://i.ibb.co/h1HG7yd/demon-slayer.jpg"
        title="Kimetsu no Yaiba"
        rating={5}
      />
    </div>
  )
}

export default App
