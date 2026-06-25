import Hero from '../../components/home/Hero'
import FeaturedProperties from '../../components/home/FeaturedProperties'
import PopularLocations from '../../components/home/PopularLocations'
import Testimonials from '../../components/home/Testimonials'
import CtaBanner from '../../components/home/CtaBanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <PopularLocations />
      <Testimonials />
      <CtaBanner />
    </>
  )
}
