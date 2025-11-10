"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

export default function ThankYouPage() {
  const router = useRouter()
  const [showChat, setShowChat] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A1A] via-gray-900 to-[#2A2A2A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-[#1A1A1A]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-white p-8 text-center">
          {/* Success checkmark icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-[#FFCC00] rounded-full flex items-center justify-center">
              <CheckCircle className="w-14 h-14 text-[#1A1A1A]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-2">Cảm ơn bạn!</h1>
          <p className="text-gray-100 text-lg">Đăng ký thành công</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Chúng tôi đã nhận được thông tin của bạn. Đội ngũ tư vấn sẽ liên hệ bạn trong vòng{" "}
              <span className="font-bold text-[#D00]">24 giờ</span> để tư vấn chi tiết về chương trình phù hợp nhất.
            </p>
          </div>

          <div className="bg-[#FFCC00]/10 border-l-4 border-l-[#FFCC00] p-4 rounded-lg text-left">
            <p className="text-sm text-gray-600 font-semibold mb-2">Những bước tiếp theo:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Chúng tôi sẽ gọi điện để xác nhận thông tin</li>
              <li>• Tư vấn chi tiết về ngành và công việc phù hợp</li>
              <li>• Thảo luận về lộ trình và điều kiện</li>
              <li>• Hỗ trợ chuẩn bị hồ sơ xin visa</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-gradient-to-r from-[#1A1A1A] to-[#D00] text-[#FFCC00] hover:opacity-90 font-semibold h-12 text-base"
            >
              Trở về trang chủ
            </Button>
            <Button
              onClick={() => router.push("/#faq")}
              variant="outline"
              className="w-full border-2 border-[#D00] text-[#1A1A1A] hover:bg-[#D00]/10 font-semibold h-12 text-base"
            >
              Xem câu hỏi thường gặp
            </Button>
          </div>

          {/* Contact Info */}
          <div className="bg-gray-50 p-4 rounded-lg mt-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3">Nếu cần liên hệ ngay:</p>
            <div className="space-y-2">
              <a href="tel:0123456789" className="block text-center font-semibold text-[#D00] hover:underline">
                📞 Gọi: 0123456789
              </a>
              <a
                href="mailto:XuatkhaulaodongDuc@tmu.com"
                className="block text-center font-semibold text-[#D00] hover:underline"
              >
                ✉️ Email: XuatkhaulaodongDuc@tmu.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
