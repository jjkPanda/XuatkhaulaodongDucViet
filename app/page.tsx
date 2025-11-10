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
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  // Added state for selected benefit and benefit detail modal
  const [selectedBenefit, setSelectedBenefit] = useState<string | null>(null)
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

  const jobDescriptions: Record<string, { title: string; desc: string; salary: string; benefits: string[] }> = {
    nursing: {
      title: "Điều dưỡng",
      desc: "Làm việc tại các bệnh viện, viện dưỡng lão và trung tâm chăm sóc sức khỏe ở Đức. Đây là ngành được tuyển dụng nhiều nhất với nhu cầu lớn.",
      salary: "28-35 triệu/tháng",
      benefits: [
        "Môi trường làm việc an toàn",
        "Bảo hiểm y tế toàn diện",
        "Cơ hội phát triển sự nghiệp",
        "Nghỉ phép 30 ngày/năm",
      ],
    },
    mechanics: {
      title: "Cơ khí",
      desc: "Làm việc tại các nhà máy sản xuất, lắp ráp máy móc công nghiệp. Công việc ổn định với thu nhập cao và môi trường làm việc chuyên nghiệp.",
      salary: "25-32 triệu/tháng",
      benefits: ["Mức lương cao", "Thưởng hiệu suất", "Đào tạo liên tục", "Phúc lợi tốt"],
    },
    construction: {
      title: "Xây dựng",
      desc: "Làm việc tại các công trình xây dựng, nhà máy, dự án cơ sở hạ tầng ở Đức. Công việc ổn định với thu nhập cao và cơ hội phát triển.",
      salary: "26-34 triệu/tháng",
      benefits: ["Thu nhập ổn định", "An toàn lao động", "Đào tạo chuyên nghiệp", "Cơ hội thăng tiến"],
    },
    hospitality: {
      title: "Khách sạn & Ẩm thực",
      desc: "Làm việc tại khách sạn 3-5 sao, nhà hàng cao cấp, hay các trung tâm hội nghị. Môi trường quốc tế, học hỏi trải nghiệm.",
      salary: "22-28 triệu/tháng",
      benefits: ["Hỗ trợ bữa ăn", "Môi trường quốc tế", "Hoa hồng tiền boa", "Cơ hội thăng tiến"],
    },
    other: {
      title: "Các ngành khác",
      desc: "Bao gồm: điện, nước, IT, logistics, giáo dục... Chúng tôi cũng tuyển dụng cho nhiều ngành khác tùy theo nhu cầu thị trường.",
      salary: "24-40 triệu/tháng",
      benefits: ["Tùy ngành", "Thu nhập cạnh tranh", "Điều kiện tốt", "Phát triển sự nghiệp"],
    },
  }

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {}

    const name = formData.get("name") as string
    const phone = formData.get("phone") as string
    const birthYear = formData.get("birthYear") as string
    const job = formData.get("job") as string

    if (!name || name.trim().length < 3) {
      errors.name = "Họ tên phải có ít nhất 3 ký tự"
    }

    // Phone validation: 10-11 digits, must be numeric
    const phoneRegex = /^\d{10,11}$/
    if (!phone || !phoneRegex.test(phone)) {
      errors.phone = "Số điện thoại phải từ 10-11 chữ số"
    }

    // Birth year validation: exactly 4 digits
    const birthYearRegex = /^\d{4}$/
    if (!birthYear || !birthYearRegex.test(birthYear)) {
      errors.birthYear = "Năm sinh phải là 4 chữ số (VD: 1995)"
    } else {
      const year = Number.parseInt(birthYear)
      const currentYear = new Date().getFullYear()
      if (year > currentYear - 18 || year < 1940) {
        errors.birthYear = "Tuổi phải từ 18 trở lên"
      }
    }

    if (!job) {
      errors.job = "Vui lòng chọn ngành nghề"
    }

    return errors
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const errors = validateForm(formData)
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

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
        e.currentTarget.reset()
        window.location.href = "/thank-you"
      }
    } catch (error) {
      localStorage.setItem("formSubmission", JSON.stringify(data))
      e.currentTarget.reset()
      window.location.href = "/thank-you"
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
            <span className="font-bold text-xl">Xuất Khẩu Đức Lao động VO </span>
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
          <Button
            className="bg-[#FFCC00] text-[#1A1A1A] hover:bg-[#E6B800]"
            onClick={() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })}
          >
            Đăng ký
          </Button>
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
                bạn đạt được ước mơ đó tại Đức, một đất nước có nền kinh tế lớn bậc nhất Châu Âu
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
                  Gọi hotline: 0123456789
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-[#FFCC00] to-[#FFB700] rounded-2xl p-8 shadow-2xl overflow-hidden border-4 border-[#D00]">
                <Image
                  src="/workers-team-industrial.jpg"
                  alt="Công nhân làm việc tại nhà máy Đức"
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
            <p className="text-gray-600 text-lg text-justify text-balance">
              Đức là điểm đến lý tưởng cho người lao động Việt Nam nhờ mức thu nhập cao, chế độ phúc lợi xã hội hàng đầu
              và cơ hội phát triển lâu dài. Khi làm việc tại Đức, bạn được đào tạo nghề bài bản theo chuẩn châu Âu, làm
              việc trong môi trường chuyên nghiệp, an toàn và minh bạch
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Thu nhập cao",
                desc: "25-40 triệu/tháng",
                details:
                  "Mức lương ở Đức cao gấp 4-5 lần so với Việt Nam. Thu nhập bắt đầu từ 25-40 triệu đồng/tháng tùy ngành. Các ngành như điều dưỡng, kỹ sư có thể lên tới 50 triệu/tháng sau khi có kinh nghiệm.",
              },
              {
                icon: Heart,
                title: "Phúc lợi tốt",
                desc: "Bảo hiểm, lương hưu, nghỉ phép",
                details:
                  "Bảo hiểm y tế, bảo hiểm thất nghiệp, lương hưu, nhân thọ đều được công ty đóng. Nghỉ phép tối thiểu 30 ngày/năm, không cộng thêm nghỉ lễ. Bảo hiểm bao phủ toàn bộ chi phí y tế.",
              },
              {
                icon: Users,
                title: "Môi trường làm việc",
                desc: "Tôn trọng quyền lao động",
                details:
                  "Đức có luật lao động chặt chẽ, bắt buộc công ty phải tuân thủ quyền lao động. Không bắt nạt, phân biệt đối xử. Quy trình khiếu nại rõ ràng, công bằng. Công ty thường tổ chức đào tạo, phát triển kỹ năng miễn phí.",
              },
              {
                icon: Globe,
                title: "Định cư lâu dài",
                desc: "Visa Blue Card & quốc tịch",
                details:
                  "Sau 4 năm làm việc, bạn có thể xin Visa xanh (Blue Card). Sau 8 năm có thể xin quốc tịch Đức. Gia đình bạn cũng được quyền sống, học tập ở Đức. Cơ hội định cư vĩnh viễn tại một nước phát triển.",
              },
            ].map((benefit, idx) => {
              const Icon = benefit.icon
              return (
                <Card
                  key={idx}
                  onClick={() => setSelectedBenefit(benefit.title)}
                  className="p-6 hover:shadow-lg transition border-l-4 border-l-[#D00] bg-white cursor-pointer transform hover:scale-105"
                >
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
            <p className="text-gray-600 text-lg text-justify">
              {
                "Chúng tôi tuyển dụng lao động sang Đức trong các ngành nghề trọng điểm như điều dưỡng, kỹ thuật cơ khí, xây dựng, điện – điện tử, và nhà hàng – khách sạn.\nMỗi ngành nghề đều được bảo đảm về hợp đồng lao động rõ ràng, mức lương cao, đào tạo bài bản và hỗ trợ định cư lâu dài"
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                name: "Điều dưỡng",
                color: "from-[#1A1A1A] to-[#D00]",
                desc: "Bệnh viện & chăm sóc",
                icon: "/nurse-with-stethoscope.png",
                key: "nursing",
              },
              {
                name: "Cơ khí",
                color: "from-[#D00] to-[#FFCC00]",
                desc: "Sản xuất & lắp ráp",
                icon: "/mechanical-engineer.jpg",
                key: "mechanics",
              },
              {
                name: "Xây dựng",
                color: "from-[#FFCC00] to-[#1A1A1A]",
                desc: "Công trình & xây lắp",
                icon: "/real-construction-workers.jpg",
                key: "construction",
              },
              {
                name: "Khách sạn",
                color: "from-[#1A1A1A] to-[#FFCC00]",
                desc: "Du lịch & ẩm thực",
                icon: "/chef-in-hotel.jpg",
                key: "hospitality",
              },
              {
                name: "Khác",
                color: "from-[#D00] to-[#1A1A1A]",
                desc: "Các ngành khác",
                icon: "/office-worker-professional.jpg",
                key: "other",
              },
            ].map((job, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedJob(job.key)}
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
                  title: "Chọn dịch vụ & Phỏng vấn",
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-4 text-center">Những câu chuyện thành công                 </h2>
            {/* Added description for testimonials */}
            <p className="text-gray-600 text-justify">
              Hàng nghìn người Việt đã chọn Đức là điểm đến để thay đổi cuộc sống. Với môi trường làm việc chuyên nghiệp, mức thu nhập cao và chính sách phúc lợi vượt trội, họ đã tìm thấy cơ hội phát triển thực sự. Dưới đây là những câu chuyện truyền cảm hứng từ chính những người lao động Việt Nam đang sinh sống và làm việc tại Đức
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Nguyễn Thị Mai",
                age: 28,
                job: "Điều dưỡng viên",
                location: "Berlin, Đức",
                duration: "3 năm tại Đức",
                text: "Từ khi sang Đức làm điều dưỡng, cuộc sống gia đình tôi thay đổi hoàn toàn. Lương tháng 3,200 Euro, được hưởng đầy đủ bảo hiểm và 28 ngày nghỉ phép. Môi trường làm việc chuyên nghiệp, được đồng nghiệp tôn trọng. Tôi đã mua được căn hộ và dự tính đưa gia đình sang sống.",
                image: "/asian-woman-nurse-smiling.jpg",
                stars: 5,
              },
              {
                name: "Trần Văn Hùng",
                age: 32,
                job: "Thợ cơ khí",
                location: "Munich, Đức",
                duration: "2 năm tại Đức",
                text: "Lúc đầu tôi lo lắng về việc học tiếng Đức và thích nghi với công ty. Nhưng đội hỗ trợ trao dạo tân tinh từ khâu đào tạo đến khi vào nhà máy. Bây giờ tôi làm kỹ sư kiểm hóa dự án với mức lương 2,900 Euro/tháng, gửi tiền về cho gia đình và vẫn có tiền tiết kiệm. Công ty rất tốt trong kỳ năng và sự chuyên nghiệp.",
                image: "/professional-asian-man-engineer.jpg",
                stars: 5,
              },
              {
                name: "Phạm Thị Lan",
                age: 26,
                job: "Nhân viên khách sạn",
                location: "Frankfurt, Đức",
                duration: "1.5 năm tại Đức",
                text: "Chương trình xuất khẩu lao động Đức đã mở ra cánh cửa mới cho tôi. Từ nhân viên khách sạn ở Việt Nam với lương 8 triệu, giờ tôi làm tại khách sạn 5 sao ở Frankfurt với thu nhập 2,600 Euro/tháng. Được học thêm nhiều kỹ năng mới và có cơ hội thăng tiến. Cảm ơn đội ngũ tư vấn đã giúp tôi thực hiện ước mơ!",
                image: "/hotel-staff-woman.jpg",
                stars: 5,
              },
            ].map((testimonial, idx) => (
              <Card key={idx} className="p-6 border-l-4 border-l-[#FFCC00] bg-white hover:shadow-lg transition">
                <div className="mb-4 leading-5">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.stars)].map((_, i) => (
                      <span key={i} className="text-[#FFCC00] text-lg">
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Quote mark */}
                  <p className="text-5xl text-gray-300 leading-none mb-4">"</p>
                </div>

                {/* Testimonial text */}
                <p className="text-gray-700 italic mb-6 leading-relaxed leading-5">{testimonial.text}</p>

                {/* Person info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#D00]"
                  />
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{testimonial.name}</p>
                    <p className="text-sm font-semibold text-[#D00]">
                      {testimonial.age} tuổi - {testimonial.job}
                    </p>
                    <p className="text-xs text-gray-600">{testimonial.location}</p>
                    <p className="text-xs text-gray-500 font-medium">{testimonial.duration}</p>
                  </div>
                </div>
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
              <label className="block text-sm font-medium mb-2">Họ và tên *</label>
              <Input
                type="text"
                name="name"
                required
                className="bg-white text-[#1A1A1A] border-0"
                placeholder="Nhập họ tên"
              />
              {formErrors.name && <p className="text-red-300 text-sm mt-1">{formErrors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
              <Input
                type="tel"
                name="phone"
                required
                className="bg-white text-[#1A1A1A] border-0"
                placeholder="Nhập số điện thoại (10-11 số)"
              />
              {formErrors.phone && <p className="text-red-300 text-sm mt-1">{formErrors.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Năm sinh *</label>
                <Input
                  type="number"
                  name="birthYear"
                  required
                  className="bg-white text-[#1A1A1A] border-0 rounded-md px-3 py-2"
                  placeholder="1990"
                />
                {formErrors.birthYear && <p className="text-red-300 text-sm mt-1">{formErrors.birthYear}</p>}
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
                {formErrors.job && <p className="text-red-300 text-sm mt-1">{formErrors.job}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#FFCC00] text-[#1A1A1A] hover:bg-[#E6B800] font-semibold h-12">
              Đăng ký ngay
            </Button>
          </form>
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

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#1A1A1A]">
            <div className="p-8 text-center">
              {/* Success checkmark icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#1A1A1A] to-[#D00] rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-[#FFCC00]" />
                </div>
              </div>

              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Cảm ơn bạn đã đăng ký!</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Chúng tôi đã nhận được thông tin của bạn. Đội ngũ tư vấn sẽ liên hệ bạn trong vòng 24 giờ để tư vấn chi
                tiết về chương trình phù hợp nhất.
              </p>

              <div className="space-y-3">
                <Button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-[#FFCC00] hover:opacity-90 font-semibold h-12"
                >
                  Trở về trang chủ
                </Button>
                <Button
                  onClick={() => {
                    setShowSuccessModal(false)
                    setChatOpen(true)
                  }}
                  variant="outline"
                  className="w-full border-2 border-[#D00] text-[#1A1A1A] hover:bg-[#D00]/10 font-semibold h-12"
                >
                  Trò chuyện với AI
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Benefit Detail Modal */}
      {selectedBenefit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#FFCC00]">
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-white p-6 flex justify-between items-start">
              <h2 className="text-2xl font-bold">{selectedBenefit}</h2>
              <button onClick={() => setSelectedBenefit(null)} className="hover:bg-white/20 p-2 rounded transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedBenefit === "Thu nhập cao" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Mức lương ở Đức cao gấp 4-5 lần so với Việt Nam. Thu nhập bắt đầu từ 25-40 triệu đồng/tháng tùy
                    ngành. Các ngành như điều dưỡng, kỹ sư có thể lên tới 50 triệu/tháng sau khi có kinh nghiệm.
                  </p>
                </div>
              )}

              {selectedBenefit === "Phúc lợi tốt" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Bảo hiểm y tế, bảo hiểm thất nghiệp, lương hưu, nhân thọ đều được công ty đóng. Nghỉ phép tối thiểu
                    30 ngày/năm, không cộng thêm nghỉ lễ. Bảo hiểm bao phủ toàn bộ chi phí y tế.
                  </p>
                </div>
              )}

              {selectedBenefit === "Môi trường làm việc" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Môi trường làm việc tại Đức chuyên nghiệp, kỷ luật và minh bạch, giúp người lao động phát triển bền
                    vững. Doanh nghiệp Đức đề cao hiệu quả, đúng giờ và an toàn lao động, đồng thời đảm bảo đầy đủ quyền
                    lợi và phúc lợi xã hội
                  </p>
                </div>
              )}

              {selectedBenefit === "Định cư lâu dài" && (
                <div>
                  <p className="text-gray-700 leading-relaxed">
                    Đức là quốc gia có chính sách định cư minh bạch và nhiều ưu đãi cho người lao động nước ngoài. Sau
                    3–5 năm làm việc và đóng thuế đầy đủ, bạn có thể xin thẻ cư trú dài hạn hoặc quốc tịch Đức, đồng
                    thời được quyền bảo lãnh người thân sang sinh sống hợp pháp
                  </p>
                </div>
              )}

              <Button
                onClick={() => setSelectedBenefit(null)}
                className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-[#FFCC00] hover:opacity-90 font-semibold h-12 mt-4"
              >
                Đóng
              </Button>
            </div>
          </Card>
        </div>
      )}

      {selectedJob && jobDescriptions[selectedJob] && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#D00]">
            <div className="bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-white p-6 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{jobDescriptions[selectedJob].title}</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="hover:bg-white/20 p-2 rounded transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-gray-700 leading-relaxed mb-4">{jobDescriptions[selectedJob].desc}</p>
              </div>

              <div className="bg-[#FFCC00]/10 border-l-4 border-l-[#FFCC00] p-4 rounded">
                <p className="text-sm text-gray-600 mb-1">Mức lương:</p>
                <p className="font-bold text-[#1A1A1A] text-lg">{jobDescriptions[selectedJob].salary}</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-[#1A1A1A] mb-3">Phúc lợi chính:</p>
                <ul className="space-y-2">
                  {jobDescriptions[selectedJob].benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => {
                  setSelectedJob(null)
                  document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })
                }}
                className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-[#FFCC00] hover:opacity-90 font-semibold h-12 mt-4"
              >
                Đăng ký cho ngành này
              </Button>
            </div>
          </Card>
        </div>
      )}

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
              <p className="text-gray-400 text-sm">Hotline: 0123456789</p>
              <p className="text-gray-400 text-sm font-normal leading-5 text-justify">Email: XkldDucVO@tmu.com</p>
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
            <p>© 2025 Chương trình Xuất khẩu Lao động Đức. All rights reserved.</p>
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
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleChatSend()}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D00]"
              />
              <button
                onClick={handleChatSend}
                className="bg-[#FFCC00] text-[#1A1A1A] p-2 rounded hover:bg-[#E6B800] transition"
              >
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
              telephone: "+84-123-456-789",
              email: "XuatkhaulaodongDuc@tmu.com",
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
