
import AuthorList from "@/components/Home/AuthorList"
import BlogList from "@/components/Home/BlogList"
import BookBestSeller from "@/components/Home/BookBestSeller"
import BookList from "@/components/Home/BookList"
import CategoriesSection from "@/components/Home/CategoriesSection"
import HeroBanner from "@/components/Home/HeroBanner"
import { Button } from "@/components/ui/button"


const HomePage = () => {
  return (
    <div className="items-center justify-center flex flex-col gap-8">

      <HeroBanner />
      <CategoriesSection />
      <BookList />
      <BookBestSeller />
      <AuthorList />
      <BlogList />
      <section className="py-6 px-4 w-full">
        <div className="max-w-7xl  mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900
    rounded-2xl shadow-md p-8 md:p-12text-center
  ">
          <h3 className="text-2xl text-center md:text-3xl font-bold mb-4 dark:text-white">
            📩 Nhận ưu đãi mới nhất
          </h3>

          <p className="text-gray-800 text-center dark:text-gray-400 mb-8">
            Đăng ký email để nhận voucher, sách hot và ưu đãi độc quyền mỗi tuần
          </p>

          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="
                  flex-1
                  rounded-xl
                  border
                  px-4 py-3
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  dark:bg-zinc-900 dark:border-zinc-700 dark:text-white
                "
            />
            <Button className="
                  rounded-xl
                  px-6 py-3
                  bg-blue-600
                  hover:bg-blue-700
                  dark:text-white
                  transition
                ">
              Đăng ký
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}

export default HomePage
