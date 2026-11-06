import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Funnel from './components/Funnel.jsx'
import Marquee from './components/Marquee.jsx'
import Features from './components/Features.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Bento from './components/Bento.jsx'
import Memory from './components/Memory.jsx'
import Cta from './components/Cta.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <div className="page-glow" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Funnel />
        <Marquee />
        <Features />
        <HowItWorks />
        <Bento />
        <Memory />
        <Cta />
      </main>
      <Footer />
    </>
  )
}
