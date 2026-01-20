
import AuthorList from "@/components/Home/AuthorList"
import BlogList from "@/components/Home/BlogList"
import BookBestSeller from "@/components/Home/BookBestSeller"
import BookList from "@/components/Home/BookList"
import CategoriesSection from "@/components/Home/CategoriesSection"
import FlashSale from "@/components/Home/FlashSale"
import HeroBanner from "@/components/Home/HeroBanner"
import { Button } from "@/components/ui/button"


const HomePage = () => {
  return (
    <div className="items-center justify-center flex flex-col gap-8">

      <HeroBanner />
      <CategoriesSection />
      <BookList />
      <BookBestSeller />
      <FlashSale />
      <AuthorList />
      <BlogList />
      <section className="bg-blue-50 py-20 px-4 flex justify-center items-center w-full dark:bg-accent">
        <div className="max-w-4xl w-full bg-blue-400 p-10 md:p-16 text-center relative overflow-hidden rounded-sm dark:bg-gray-800">

          <div className="absolute top-4 left-4 grid grid-cols-2 gap-1 opacity-20">
            <div className="w-2 h-2 bg-white"></div>
            <div className="w-2 h-2 bg-white"></div>
          </div>

          <h2 className="text-white text-3xl md:text-5xl font-bold mb-6">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
            Sed eu feugiat amet, libero ipsum enim pharetra hac dolor sit amet,
            consectetur. Elit adipiscing enim pharetra hac.
          </p>

          <div className="max-w-2xl mx-auto bg-white p-2 shadow-xl flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex flex-1 items-center px-4 py-2 border border-gray-100 md:border-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <input
                type="email"
                placeholder="youremail123@gmail.com"
                className="w-full outline-none text-gray-600 placeholder-gray-400"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-10 tracking-widest transition-colors uppercase text-sm">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
