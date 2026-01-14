import AuthorCard from "@/components/AuthorCard"
import AuthorList from "@/components/Home/AuthorList"
import BlogList from "@/components/Home/BlogList"
import BookBestSeller from "@/components/Home/BookBestSeller"
import BookList from "@/components/Home/BookList"
import CategoriesSection from "@/components/Home/CategoriesSection"
import HeroBanner from "@/components/Home/HeroBanner"
import MainNavigation from "@/components/Home/MainNavigation"
import { Button } from "@/components/ui/button"


const HomePage = () => {
  return (
    <div className="items-center justify-center flex flex-col gap-8">
      <MainNavigation />
      <HeroBanner />
      <CategoriesSection />
      <BookList />
      <BookBestSeller />
      <AuthorList />
      <BlogList/>
      <section className="py-16 bg-muted rounded-lg w-full">
        <div className="max-w-xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold mb-4">Nhận ưu đãi mới nhất 📩</h3>
          <p className="text-muted-foreground mb-6">Đăng ký email để nhận voucher và sách hot</p>
          <div className="flex gap-2">
            <input
              placeholder="Email của bạn"
              className="flex-1 rounded-xl border-2 px-4 py-2"
            />
            <Button className="bg-blue-600 hover:bg-blue-800 cursor-pointer dark:text-white">Đăng ký</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
