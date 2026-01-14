import { Mail, Phone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
const Support = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,     // thời gian animation
      once: true,        // chỉ chạy 1 lần
      easing: "ease-out-cubic",
    })
  }, [])
  return (
    <div className="bg-background">

      {/* HERO */}
      <section data-aos="fade-up" className=" py-20 px-6 md:px-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Trung tâm <span className="text-blue-600">Hỗ trợ</span> 📞
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn trong quá trình mua sắm và sử dụng dịch vụ tại BookShop.
        </p>
      </section>

      {/* SUPPORT METHODS */}
      <section className="py-16 px-6 md:px-16 bg-muted">
        <div data-aos="zoom-in"
          data-aos-delay="100" className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

          <div className="bg-background rounded-xl p-6 shadow hover:shadow-lg transition text-center">
            <MessageCircle className="mx-auto w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Chat trực tiếp</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Trò chuyện với đội ngũ hỗ trợ 24/7.
            </p>
            <Button variant="outline">Bắt đầu chat</Button>
          </div>

          <div className="bg-background rounded-xl p-6 shadow hover:shadow-lg transition text-center">
            <Mail className="mx-auto w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Email</h3>
            <p className="text-sm text-muted-foreground mb-4">
              support@bookshop.vn
            </p>
            <Button variant="outline">Gửi email</Button>
          </div>

          <div className="bg-background rounded-xl p-6 shadow hover:shadow-lg transition text-center">
            <Phone className="mx-auto w-10 h-10 text-blue-600 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Hotline</h3>
            <p className="text-sm text-muted-foreground mb-4">
              1900 123 456
            </p>
            <Button variant="outline">Gọi ngay</Button>
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section data-aos="fade-right" className="py-20 px-6 md:px-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">
            Câu hỏi thường gặp ❓
          </h2>

          <div className="space-y-6">
            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold mb-2">
                📦 Bao lâu thì tôi nhận được sách?
              </h4>
              <p className="text-muted-foreground text-sm">
                Thời gian giao hàng từ 1–3 ngày làm việc tùy khu vực.
              </p>
            </div>

            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold mb-2">
                💳 Tôi có thể thanh toán bằng những cách nào?
              </h4>
              <p className="text-muted-foreground text-sm">
                BookShop hỗ trợ COD, chuyển khoản, ví điện tử và thẻ ngân hàng.
              </p>
            </div>

            <div className="p-6 rounded-xl border">
              <h4 className="font-semibold mb-2">
                🔄 Tôi có thể đổi/trả sách không?
              </h4>
              <p className="text-muted-foreground text-sm">
                Có, trong vòng 7 ngày nếu sách bị lỗi hoặc hư hỏng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section  data-aos="zoom-in-up" className="py-20 px-6 md:px-16 bg-muted">
        <div className="max-w-3xl mx-auto bg-background p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Gửi yêu cầu hỗ trợ ✍️
          </h2>

          <form className="space-y-4">
            <Input placeholder="Họ và tên" />
            <Input type="email" placeholder="Email" />
            <Textarea placeholder="Nội dung cần hỗ trợ..." rows={4} />
            <Button className="w-full bg-blue-600 hover:bg-blue-800 dark:text-white">
              Gửi yêu cầu
            </Button>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section data-aos="fade-up"className="py-16 px-6 md:px-16 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Bạn cần hỗ trợ ngay?
        </h3>
        <p className="text-muted-foreground mb-6">
          Đội ngũ BookShop luôn sẵn sàng đồng hành cùng bạn.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-800 dark:text-white">
          Liên hệ ngay
        </Button>
      </section>

    </div>
  )
}

export default Support

