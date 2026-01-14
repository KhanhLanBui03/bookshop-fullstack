import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import AOS from "aos"
import "aos/dist/aos.css"

const AboutPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      easing: "ease-out-cubic",
    })
  }, [])

  return (
    <div className="bg-background">

      {/* HERO */}
      <section
        className="py-20 px-6 md:px-16 text-center"
        data-aos="fade-down"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Về <span className="text-blue-600">BookShop</span> 📚
        </h1>
        <p className="max-w-2xl mx-auto text-muted-foreground text-lg">
          Nền tảng mua sách trực tuyến giúp bạn tiếp cận tri thức dễ dàng,
          nhanh chóng và đáng tin cậy.
        </p>
      </section>

      {/* INTRO */}
      <section className="px-6 md:px-16 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img
            src="/about-us.webp"
            alt="About BookShop"
            className="rounded-2xl shadow-lg"
            data-aos="fade-right"
          />

          <div data-aos="fade-left">
            <h2 className="text-3xl font-bold mb-4">
              Chúng tôi là ai?
            </h2>
            <p className="text-muted-foreground mb-4">
              BookShop được xây dựng nhằm mang đến trải nghiệm mua sách
              hiện đại, nhanh chóng và tiện lợi cho mọi người.
            </p>
            <p className="text-muted-foreground">
              Từ sách công nghệ, kỹ năng, kinh doanh cho đến tiểu thuyết
              và truyện tranh – tất cả đều có tại BookShop.
            </p>
          </div>
        </div>
      </section>

      {/* HISTORY */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-10"
            data-aos="fade-up"
          >
            Hành trình phát triển
          </h2>

          <div className="space-y-6">
            <div data-aos="fade-up">
              <p className="font-semibold">2022</p>
              <p className="text-muted-foreground">
                BookShop ra đời với hơn 500 đầu sách.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="100">
              <p className="font-semibold">2023</p>
              <p className="text-muted-foreground">
                Đạt 5.000+ người dùng và mở rộng danh mục sách.
              </p>
            </div>

            <div data-aos="fade-up" data-aos-delay="200">
              <p className="font-semibold">2024</p>
              <p className="text-muted-foreground">
                Hoàn thiện nền tảng thương mại điện tử BookShop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION - VISION - VALUE */}
      <section className="bg-muted py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div
            className="bg-background rounded-xl p-6 shadow hover:shadow-lg transition"
            data-aos="zoom-in"
          >
            <h3 className="text-xl font-semibold mb-3">📖 Sứ mệnh</h3>
            <p className="text-muted-foreground">
              Lan tỏa văn hóa đọc và đưa tri thức đến gần hơn với mọi người.
            </p>
          </div>

          <div
            className="bg-background rounded-xl p-6 shadow hover:shadow-lg transition"
            data-aos="zoom-in"
            data-aos-delay="100"
          >
            <h3 className="text-xl font-semibold mb-3">🚀 Tầm nhìn</h3>
            <p className="text-muted-foreground">
              Trở thành nền tảng sách trực tuyến hàng đầu Việt Nam.
            </p>
          </div>

          <div
            className="bg-background rounded-xl p-6 shadow hover:shadow-lg transition"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <h3 className="text-xl font-semibold mb-3">💙 Giá trị cốt lõi</h3>
            <p className="text-muted-foreground">
              Chất lượng – Uy tín – Trải nghiệm người dùng.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div data-aos="fade-up">
            <p className="text-4xl font-bold text-blue-600">10K+</p>
            <p className="text-muted-foreground">Đầu sách</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="100">
            <p className="text-4xl font-bold text-blue-600">5K+</p>
            <p className="text-muted-foreground">Khách hàng</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="200">
            <p className="text-4xl font-bold text-blue-600">1K+</p>
            <p className="text-muted-foreground">Đánh giá 5⭐</p>
          </div>
          <div data-aos="fade-up" data-aos-delay="300">
            <p className="text-4xl font-bold text-blue-600">99%</p>
            <p className="text-muted-foreground">Hài lòng</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-muted py-20 px-6 md:px-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="text-3xl font-bold mb-10"
            data-aos="fade-up"
          >
            Vì sao chọn BookShop?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div
              className="p-6 rounded-xl bg-background shadow"
              data-aos="flip-left"
            >
              🚚
              <h4 className="font-semibold mt-3 mb-2">Giao hàng nhanh</h4>
              <p className="text-muted-foreground text-sm">
                Nhận sách chỉ trong 1–3 ngày.
              </p>
            </div>

            <div
              className="p-6 rounded-xl bg-background shadow"
              data-aos="flip-left"
              data-aos-delay="100"
            >
              💳
              <h4 className="font-semibold mt-3 mb-2">Thanh toán an toàn</h4>
              <p className="text-muted-foreground text-sm">
                Hỗ trợ nhiều phương thức thanh toán.
              </p>
            </div>

            <div
              className="p-6 rounded-xl bg-background shadow"
              data-aos="flip-left"
              data-aos-delay="200"
            >
              📞
              <h4 className="font-semibold mt-3 mb-2">Hỗ trợ 24/7</h4>
              <p className="text-muted-foreground text-sm">
                Luôn sẵn sàng hỗ trợ bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 md:px-16 text-center"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-6">
          Sẵn sàng khám phá tri thức?
        </h2>
        <p className="text-muted-foreground mb-8">
          Hàng ngàn cuốn sách đang chờ bạn tại BookShop.
        </p>

        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-800 dark:text-white"
        >
          <Link to="/">Khám phá ngay</Link>
        </Button>
      </section>

    </div>
  )
}

export default AboutPage
