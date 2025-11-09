"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ChevronRight, Send, MessageCircle, X, Users, TrendingUp, Heart, Globe, CheckCircle } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Xin chào! Tôi là trợ lý AI của Chương trình Xuất khẩu Lao động Đức. Bạn có câu hỏi gì không?",
      },
    ],
  })

  const scrollToChat = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  useEffect(scrollToChat, [messages])

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      birthYear: formData.get("birthYear"),
      job: formData.get("job"),
    }

    try {
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      })

      if (response.ok) {
        setIsFormSubmitted(true)
        setTimeout(() => setIsFormSubmitted(false), 3000)
        e.currentTarget.reset()
      }
    } catch (error) {
      localStorage.setItem("formSubmission", JSON.stringify(data))
      setIsFormSubmitted(true)
      setTimeout(() => setIsFormSubmitted(false), 3000)
      e.currentTarget.reset()
    }
  }

  const handleChatSend = () => {
    if (!input.trim()) return
    append({ role: "user", content: input })
    setInput("")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-[#1A1A1A] text-white px-4 py-4 sticky top-0 z-40 border-b-4 border-[#FFCC00]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl">Xuất Khẩu Đức 2025</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#benefits" className="hover:text-[#FFCC00] transition">
              Lợi ích
            </a>
            <a href="#jobs" className="hover:text-[#FFCC00] transition">
              Ngành nghề
            </a>
            <a href="#process" className="hover:text-[#FFCC00] transition">
              Quy trình
            </a>
            <a href="#faq" className="hover:text-[#FFCC00] transition">
              Câu hỏi
            </a>
          </div>
          <Button className="bg-[#FFCC00] text-[#1A1A1A] hover:bg-[#E6B800]">Đăng ký</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white py-16 md:py-24 relative overflow-hidden border-b-4 border-[#D00]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFCC00] rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D00] rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block bg-[#D00] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                Cơ hội 2025
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Thay đổi cuộc sống với Chương trình Xuất khẩu Lao động Đức
              </h1>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Bạn đang tìm cơ hội công việc với mức lương cao, phúc lợi châu Âu và lộ trình định cư? Chúng tôi sẽ giúp
                bạn đạt được ước mơ đó tại Đức - đất nước có nền kinh tế lớn nhất châu Âu.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#FFCC00] text-[#1A1A1A] hover:bg-[#E6B800] font-semibold"
                  onClick={() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Đăng ký tư vấn miễn phí
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                >
                  Gọi hotline: 1900 XXXX
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFCC00] to-[#FFB700] rounded-2xl p-8 shadow-2xl overflow-hidden border-4 border-[#D00]">
                <Image
                  src="/professional-man-in-business-suit-holding-tablet-c.jpg"
                  alt="Professional man in business suit"
                  width={400}
                  height={400}
                  className="rounded-xl object-cover w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-16 md:py-24 bg-gray-50 border-b-4 border-[#FFCC00]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Lợi ích vượt trội</h2>
            <p className="text-gray-600 text-lg">So với các quốc gia khác, Đức cung cấp cơ hội tốt nhất</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: TrendingUp, title: "Thu nhập cao", desc: "25-40 triệu/tháng" },
              { icon: Heart, title: "Phúc lợi tốt", desc: "Bảo hiểm, lương hưu, nghỉ phép" },
              { icon: Users, title: "Môi trường làm việc", desc: "Tôn trọng quyền lao động" },
              { icon: Globe, title: "Định cư lâu dài", desc: "Visa Blue Card & quốc tịch" },
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <Card key={idx} className="p-6 hover:shadow-lg transition border-l-4 border-l-[#D00] bg-white">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1A1A1A] to-[#D00] rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#FFCC00]" />
                  </div>
                  <h3 className="font-semibold text-lg text-[#1A1A1A] mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.desc}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 border-b-4 border-[#D00]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Ngành nghề tuyển dụng</h2>
            <p className="text-gray-600 text-lg">Chúng tôi tuyển dụng cho các ngành công nghiệp chính của Đức</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                name: "Điều dưỡng",
                color: "from-[#1A1A1A] to-[#D00]",
                desc: "Bệnh viện & chăm sóc",
                icon: "/nurse-with-stethoscope.png",
              },
              {
                name: "Cơ khí",
                color: "from-[#D00] to-[#FFCC00]",
                desc: "Sản xuất & lắp ráp",
                icon: "/mechanical-engineer.jpg",
              },
              {
                name: "Xây dựng",
                color: "from-[#FFCC00] to-[#1A1A1A]",
                desc: "Công trình & nội thất",
                icon: "/construction-worker-safety.png",
              },
              {
                name: "Khách sạn",
                color: "from-[#1A1A1A] to-[#FFCC00]",
                desc: "Du lịch & ẩm thực",
                icon: "/chef-in-hotel.jpg",
              },
              {
                name: "Khác",
                color: "from-[#D00] to-[#1A1A1A]",
                desc: "Các ngành khác",
                icon: "/professional-workers.jpg",
              },
            ].map((job, idx) => (
              <div
                key={idx}
                className="group cursor-pointer rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className={`relative h-64 bg-gradient-to-br ${job.color} overflow-hidden`}>
                  <Image
                    src={job.icon || "/placeholder.svg"}
                    alt={job.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all duration-300"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                    <h3 className="font-bold text-xl mb-1">{job.name}</h3>
                    <p className="text-sm opacity-90">{job.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white border-b-4 border-[#FFCC00]"
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Quy trình tham gia</h2>
            <p className="text-gray-600 text-lg">5 bước đơn giản từ đăng ký đến xuất cảnh</p>
          </div>

          <div className="flex flex-col md:flex-row gap-0">
            {/* Left side - Step indicators */}
            <div className="flex md:flex-col md:w-1/5 relative">
              {/* Vertical line connector */}
              <div className="hidden md:block absolute left-6 top-16 bottom-0 w-1 bg-gradient-to-b from-[#1A1A1A] via-[#D00] to-[#FFCC00]"></div>

              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className="flex-1 md:h-32 flex md:flex-col items-center justify-center relative z-10 md:mb-8"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#1A1A1A] to-[#D00] rounded-xl flex items-center justify-center text-[#FFCC00] font-bold text-2xl shadow-lg border-4 border-white">
                    {step}
                  </div>
                  {step < 5 && (
                    <div className="h-8 md:h-0 md:w-8 mx-2 md:mx-0 bg-gradient-to-r md:bg-gradient-to-b from-[#D00] to-[#FFCC00] md:hidden"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Details */}
            <div className="flex-1 md:w-4/5 md:pl-12 space-y-6">
              {[
                {
                  step: 1,
                  title: "Đăng ký & Tư vấn",
                  desc: "Điền form đăng ký trên website. Chuyên viên tư vấn sẽ liên hệ bạn trong vòng 24h để tư vấn chi tiết về chương trình.",
                  time: "1-2 ngày",
                  benefits: ["Tư vấn miễn phí 100%", "Đánh giá hồ sơ ban đầu"],
                },
                {
                  step: 2,
                  title: "Chọn đơn hàng & Phỏng vấn",
                  desc: "Xem danh sách các công ty tuyển dụng ở Đức. Phỏng vấn trực tuyến hoặc trực tiếp để xác định phù hợp.",
                  time: "1-2 tuần",
                  benefits: ["Nhiều lựa chọn công việc", "Phỏng vấn chuyên nghiệp"],
                },
                {
                  step: 3,
                  title: "Đào tạo & Chuẩn bị hồ sơ",
                  desc: "Tham gia các khóa đào tạo kỹ năng ngôn ngữ và chuyên môn. Chuẩn bị tất cả hồ sơ xin visa cần thiết.",
                  time: "4-6 tuần",
                  benefits: ["Đào tạo miễn phí", "Hỗ trợ hồ sơ visa"],
                },
                {
                  step: 4,
                  title: "Xin visa & Quyết định",
                  desc: "Gửi hồ sơ xin visa. Chờ quyết định từ đại sứ quán và công ty nhà tuyển dụng của Đức.",
                  time: "2-4 tuần",
                  benefits: ["Hỗ trợ xin visa", "Theo dõi tiến độ"],
                },
                {
                  step: 5,
                  title: "Xuất cảnh & Bắt đầu",
                  desc: "Nhận visa, lên máy bay và bắt đầu công việc của bạn tại Đức. Hỗ trợ định cư và hòa nhập cộng đồng.",
                  time: "Sẵn sàng",
                  benefits: ["Sân bay đón tiếp", "Hỗ trợ định cư"],
                },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  className="p-6 border-0 border-l-4 border-l-[#D00] bg-white hover:shadow-lg transition transform hover:translate-x-2"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-xl text-[#1A1A1A]">{item.title}</h3>
                    <span className="bg-[#FFCC00] text-[#1A1A1A] px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ml-4">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{item.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.benefits.map((benefit, bidx) => (
                      <div
                        key={bidx}
                        className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full text-sm text-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 border-b-4 border-[#D00]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Chứng thực từ những người thực</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Nguyễn Văn A",
                job: "Kỹ sư Cơ khí",
                text: "Chương trình tuyệt vời! Tôi đã tìm được công việc với mức lương gấp 4 lần so với Việt Nam. Phúc lợi và môi trường làm việc rất tốt.",
                image: "/professional-asian-man-engineer.jpg",
              },
              {
                name: "Trần Thị B",
                job: "Điều dưỡng",
                text: "Tôi rất biết ơn đội hỗ trợ tận tình. Quá trình từ đăng ký đến xuất cảnh diễn ra suôn sẻ. Giờ tôi đã định cư tại Đức.",
                image: "/asian-woman-nurse-smiling.jpg",
              },
              {
                name: "Lê Minh C",
                job: "Công nhân Xây dựng",
                text: "Thu nhập cao, làm việc chuyên nghiệp. Đức là đất nước tuyệt vời để sống và làm việc. Tôi khuyến khích mọi người nên thử.",
                image: "/asian-man-construction-worker.jpg",
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-[#FFCC00] bg-white hover:shadow-lg transition">
                <div className="flex gap-4 mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D00]"
                  />
                  <div>
                    <p className="font-semibold text-[#1A1A1A]">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.job}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">{`"${testimonial.text}"`}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section
        id="form"
        className="py-16 md:py-24 bg-gradient-to-r from-[#1A1A1A] to-[#2A2A2A] text-white border-b-4 border-[#FFCC00]"
      >
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Đăng ký tư vấn miễn phí</h2>
            <p className="text-gray-300 text-lg">Điền thông tin dưới đây và chúng tôi sẽ liên hệ bạn trong 24 giờ</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Họ tên *</label>
              <Input
                type="text"
                name="name"
                required
                className="bg-white text-[#1A1A1A] border-0"
                placeholder="Nhập họ tên"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
              <Input
                type="tel"
                name="phone"
                required
                className="bg-white text-[#1A1A1A] border-0"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Năm sinh *</label>
                <Input
                  type="number"
                  name="birthYear"
                  required
                  className="bg-white text-[#1A1A1A] border-0"
                  placeholder="1990"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Ngành nghề *</label>
                <select name="job" required className="w-full bg-white text-[#1A1A1A] border-0 rounded-md px-3 py-2">
                  <option value="">Chọn ngành</option>
                  <option value="nursing">Điều dưỡng</option>
                  <option value="mechanics">Cơ khí</option>
                  <option value="construction">Xây dựng</option>
                  <option value="hospitality">Khách sạn</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#FFCC00] text-[#1A1A1A] hover:bg-[#E6B800] font-semibold h-12">
              Đăng ký ngay
            </Button>
          </form>

          {isFormSubmitted && (
            <div className="mt-4 p-4 bg-green-500 rounded-lg text-white text-center">
              Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm.
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 md:py-24 border-b-4 border-[#D00]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4">Câu hỏi thường gặp</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Tôi cần điều kiện gì để tham gia chương trình?",
                a: "Bạn cần từ 18 tuổi, sức khỏe tốt, và có kỹ năng cơ bản cho ngành mong muốn. Chúng tôi sẽ hỗ trợ đào tạo kỹ năng và ngôn ngữ.",
              },
              {
                q: "Chi phí tham gia là bao nhiêu?",
                a: "Chương trình tư vấn hoàn toàn miễn phí. Chi phí visa và đào tạo sẽ được giảm khi bạn có việc làm.",
              },
              {
                q: "Thời gian từ đăng ký đến xuất cảnh là bao lâu?",
                a: "Thường mất 2-3 tháng tùy vào ngành nghề và công ty. Một số vị trí ưu tiên có thể nhanh hơn.",
              },
              {
                q: "Tôi có thể đưa gia đình sang Đức không?",
                a: "Có, sau 6 tháng làm việc bạn có thể làm đơn để gia đình sống cùng. Chúng tôi sẽ giúp toàn bộ quá trình.",
              },
              {
                q: "Việc làm ở Đức có an toàn không?",
                a: "Rất an toàn. Đức có luật lao động chặt chẽ và tôn trọng quyền lao động. Môi trường làm việc chuyên nghiệp và an toàn.",
              },
            ].map((item, idx) => (
              <Card
                key={idx}
                className="p-6 border-0 border-l-4 border-l-[#FFCC00] bg-gray-50 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-[#1A1A1A] mb-3">{item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A1A] text-white py-12 border-t-4 border-[#D00]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#FFCC00]">Về chúng tôi</h3>
              <p className="text-gray-400 text-sm">
                Chương trình Xuất khẩu Lao động Đức uy tín, an toàn và chuyên nghiệp.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#FFCC00]">Liên hệ</h3>
              <p className="text-gray-400 text-sm">Hotline: 1900 XXXX</p>
              <p className="text-gray-400 text-sm">Email: info@xuatkhaoduc.com</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#FFCC00]">Địa chỉ</h3>
              <p className="text-gray-400 text-sm">Số 79 Hồ Tùng Mậu, phường Mai Dịch, quận Cầu Giấy, Hà Nội</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4 text-[#FFCC00]">Chính sách</h3>
              <a href="#" className="text-gray-400 text-sm hover:text-[#FFCC00] block">
                Bảo mật thông tin
              </a>
              <a href="#" className="text-gray-400 text-sm hover:text-[#FFCC00] block">
                Điều khoản sử dụng
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Chương trình Xuất khẩo Lao động Đức. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* AI Chatbox */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 bg-gradient-to-br from-[#1A1A1A] to-[#D00] text-[#FFCC00] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition transform hover:scale-110 border-2 border-[#FFCC00]"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
        ) : (
          <Card className="w-96 h-[500px] flex flex-col border-0 shadow-2xl border-2 border-[#D00]">
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-white p-4 flex justify-between items-center rounded-t-lg">
              <h3 className="font-bold">Trợ lý AI</h3>
              <button onClick={() => setChatOpen(false)} className="hover:bg-white/20 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === "user" ? "bg-[#1A1A1A] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t p-4 flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Nhập câu hỏi..."
                className="border-gray-300"
              />
              <button onClick={handleChatSend} className="bg-[#FFCC00] text-[#1A1A1A] p-2 rounded hover:bg-[#E6B800]">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </Card>
        )}
      </div>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Chương trình Xuất khẩu Lao động Đức",
            description:
              "Chương trình xuất khẩu lao động uy tín, giúp bạn tìm công việc tại Đức với mức lương cao và phúc lợi tốt",
            url: "https://xuatkhaoduc.com",
            logo: "https://xuatkhaoduc.com/logo.png",
            sameAs: ["https://www.facebook.com/xuatkhaoduc", "https://www.youtube.com/@xuatkhaoduc"],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Service",
              telephone: "+84-1900-XXXX",
              email: "info@xuatkhaoduc.com",
            },
            address: {
              "@type": "PostalAddress",
              streetAddress: "Số 79 Hồ Tùng Mậu, phường Mai Dịch",
              addressLocality: "Hà Nội",
              addressRegion: "Hà Nội",
              postalCode: "100000",
              addressCountry: "VN",
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Chương trình Xuất khẩu Lao động Đức",
            description: "Dịch vụ tuyển dụng và hỗ trợ xuất khẩu lao động sang Đức",
            provider: {
              "@type": "Organization",
              name: "Xuất Khẩu Đức 2025",
            },
            areaServed: {
              "@type": "Country",
              name: "Vietnam",
            },
            offers: {
              "@type": "Offer",
              priceCurrency: "VND",
              price: "0",
              description: "Tư vấn miễn phí",
              priceValidUntil: "2025-12-31",
            },
            image: "https://xuatkhaoduc.com/og-image.png",
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Tôi cần điều kiện gì để tham gia chương trình?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Bạn cần từ 18 tuổi, sức khỏe tốt, và có kỹ năng cơ bản cho ngành mong muốn. Chúng tôi sẽ hỗ trợ đào tạo kỹ năng và ngôn ngữ.",
                },
              },
              {
                "@type": "Question",
                name: "Chi phí tham gia là bao nhiêu?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Chương trình tư vấn hoàn toàn miễn phí. Chi phí visa và đào tạo sẽ được giảm khi bạn có việc làm.",
                },
              },
              {
                "@type": "Question",
                name: "Thời gian từ đăng ký đến xuất cảnh là bao lâu?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Thường mất 2-3 tháng tùy vào ngành nghề và công ty. Một số vị trí ưu tiên có thể nhanh hơn.",
                },
              },
              {
                "@type": "Question",
                name: "Tôi có thể đưa gia đình sang Đức không?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Có, sau 6 tháng làm việc bạn có thể làm đơn để gia đình sống cùng. Chúng tôi sẽ giúp toàn bộ quá trình.",
                },
              },
              {
                "@type": "Question",
                name: "Việc làm ở Đức có an toàn không?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Rất an toàn. Đức có luật lao động chặt chẽ và tôn trọng quyền lao động. Môi trường làm việc chuyên nghiệp và an toàn.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  )
}
