# MotoAI v40 – Chatbot JS cho trang thuê xe máy Hà Nội

Repo này chứa landing page và file JS **`motoai_v40_right_fixed.js`** dùng để gắn một **chatbot nổi ở góc phải** (bubble + hộp chat) cho website:

> **https://motorbikenguyenha.github.io/hanoi/**  
> Chuyên: Thuê & bán xe máy – Nguyên Hà, Hà Nội

Chatbot được tối ưu cho **khách thuê/mua xe máy tại Hà Nội**, hiểu tiếng Việt, trả lời nhanh về:
- Giá thuê (theo ngày / tuần / tháng)
- Loại xe: Vision, Air Blade, Wave, Sirius, xe số, xe ga, xe côn tay, xe điện, 50cc…
- Thủ tục, giấy tờ, cọc, giao/nhận xe, giờ mở cửa
- Hỗ trợ khách du lịch (tourist), expat, người địa phương

---

## 1. Tính năng chính

### 🧠 Chatbot thông minh, không cần backend

File `motoai_v40_right_fixed.js`:
- **Không dùng server riêng, không gọi API** → mọi logic xử lý ngay trên trình duyệt.
- Tự:
  - Nhận diện ngôn ngữ (vi / en) – ưu tiên tiếng Việt.
  - Phân tích **intent**: hỏi giá, hỏi giấy tờ, liên hệ, giao xe, trả xe, chính sách…
  - Nhận diện **kiểu khách**: tourist / expat / local / general.
  - Nhận diện **nhu cầu**: thuê / mua / cả hai.
  - Ước lượng giá thuê dựa trên **bảng giá cứng** trong code.

### 💰 Engine tính giá (giá thuê xe) tích hợp sẵn

- Bảng giá ngay trong JS (`PRICE_TABLE`):
  - 50cc, xe số, xe ga
  - Vision, Air Blade, Wave, Sirius, Lead, Vespa, Grande, Janus, SH, Liberty, xe côn tay, xe điện…
- Tự nhận dạng:
  - Thời gian thuê: `3 ngày`, `1 tuần`, `2 tháng`, hoặc dạng **khoảng ngày**: `12/3 - 18/3`.
- Trả lời dạng:
  - Khoảng giá theo **ngày / tuần / tháng**
  - Ước lượng **tổng chi phí** cho toàn bộ thời gian thuê.

### 📚 Học từ nội dung trang (extractive QA)

- Tự lấy text từ `document.body.innerText`, lưu vào localStorage:
  - Dùng thuật toán đơn giản kiểu **BM25 nhẹ** để tìm câu trả lời ngắn trong nội dung trang.
- Ưu tiên:
  1. Trả lời nhanh theo rule (FAQ, price, contact)
  2. Nếu không khớp, sẽ **trích nội dung** từ landing page để trả lời.

### 🗣 Trả lời tự nhiên, đã “làm mượt” tiếng Việt

- Hàm `naturalize()` loại bớt mấy từ dư kiểu `ạ`, `nhé`, `nha` → câu gọn, lịch sự, cuối câu auto thêm dấu chấm.
- Loại link/markdown trong câu trả lời:
  - `CFG.noLinksInReply = true`
  - `CFG.noMarkdownReply = true`

### 💾 Ghi nhớ lịch sử chat (per browser)

- Lưu trong `localStorage`:
  - `MotoAI_v40_session` – lịch sử hội thoại (tối đa 10 lượt).
  - `MotoAI_v40_ctx` – context ngắn hạn (turns gần nhất để giữ ngữ cảnh).
  - `MotoAI_v40_learn` – nội dung text trang dùng cho extractive QA.
- Người dùng có thể gõ **`reset`** hoặc **`clear`** để xóa lịch sử chat.

### 💬 Quick Replies (nút gợi ý câu hỏi)

- Bên dưới khung chat có **thanh tag**:
  - Gợi ý “Tôi là khách du lịch…”, “Thuê theo tháng…”, “Giá thuê xe…”, “Tiền cọc & hư hỏng”, “Giao nhận xe…”
- Tự thay đổi tùy theo:
  - Người dùng vừa hỏi về **giá**, **giấy tờ**, **giao xe**, hay **mua xe**.

---

## 2. Giao diện & UX

### 🎈 Bubble chat góc phải (right side, fixed)

- Nút **chat bubble** ở góc dưới bên phải:
  - Animation nhẹ, label “Chat”
  - Hover có shadow, bounce đơn giản.
- Được nâng cao (`--m-bottom-offset: 80px`) để tránh đè lên **bottom bar của iOS**.

### 💬 Hộp chat (chat card)

- Hiển thị bên phải, responsive:
  - Desktop: card 420px cố định bên phải.
  - Mobile: full chiều ngang (left: 8px, right: 8px).
- Có:
  - Header gradient (theo màu brand / themeColor).
  - Avatar emoji (mặc định 👩‍💼).
  - Trạng thái “Usually replies within a few minutes”.
  - Nút quick action:
    - 📞 Call
    - Z – Zalo
    - 📍 Map (link Google Maps nếu cấu hình).

### 🌙 Tự bắt theme sáng / tối

- Tự nhận biết:
  - `prefers-color-scheme: dark`
  - hoặc class / data-theme của `<html>` / `<body>`.
- Điều chỉnh:
  - Nền, khung chat, bubble tin nhắn, input.
- Có `MutationObserver` theo dõi nếu site có **chuyển dark mode bằng JS**, input chat vẫn sync theme.

---

## 3. Cấu hình & tích hợp

### 3.1. Cấu hình cơ bản (global config)

Trước khi load script, có thể khai báo:

```html
<script>
  window.MotoAI_CONFIG = {
    brand: "Nguyen Ha",
    phone: "+84 33 4699969",
    zalo: "https://zalo.me/0334699969",
    map: "https://maps.app.goo.gl/ZyGZA84iYYisGFgt6?g_st=ipc",
    themeColor: "#0084FF",

    // Tùy chọn nâng cao (có thể giữ mặc định)
    autolearn: true,
    viOnly: true,
    deepContext: true,
    maxContextTurns: 5,
    smart: {
      semanticSearch: true,
      extractiveQA:   true,
      autoPriceLearn: true
    },
    noLinksInReply: true,
    noMarkdownReply: true
  };
</script>
<script src="motoai_v40_right_fixed.js" async></script>

Nếu không khai báo gì, script sẽ dùng mặc định (DEF) bên trong file:
	•	brand: "Nguyen Ha"
	•	phone: "+84 33 4699969"
	•	avatar: "👩‍💼"
	•	themeColor: "#0084FF"

Nếu không đặt zalo, script sẽ tự tạo:

ORG.zalo = "https://zalo.me/" + phone_without_space;

3.2. Tham số chính trong cấu hình

Key	Kiểu	Mặc định	Ý nghĩa
brand	string	“Nguyen Ha”	Tên thương hiệu hiển thị trên header chatbot
phone	string	“+84 33 4699969”	Hotline gọi nhanh (nút 📞)
zalo	string	auto từ phone	Link chat Zalo
map	string	""	Link Google Maps cửa hàng
avatar	string	“👩‍💼”	Emoji avatar trong header
themeColor	string	“#0084FF”	Màu chủ đạo cho bubble/theme
autolearn	boolean	true	Auto đọc nội dung trang để hỗ trợ trả lời
viOnly	boolean	true	Ưu tiên tiếng Việt trong hội thoại
deepContext	boolean	true	Lưu ngữ cảnh nhiều lượt để trả lời tốt hơn
maxContextTurns	number	5	Số lượt context được lưu (3–8)
smart.semanticSearch	boolean	true	Tìm câu phù hợp trong nội dung trang
smart.extractiveQA	boolean	true	Bật chế độ trả lời trích đoạn
debug	boolean	true	Log info console.log khi khởi động


⸻

4. Cách sử dụng trong index.html

4.1. Thêm chatbot vào mọi trang

Ngay trước thẻ </body> của index.html (hoặc bất kỳ trang nào), dán:

<script>
  window.MotoAI_CONFIG = {
    brand: "Nguyen Ha",
    phone: "+84 33 4699969",
    zalo: "https://zalo.me/0334699969",
    map: "https://maps.app.goo.gl/ZyGZA84iYYisGFgt6?g_st=ipc"
    // Có thể thêm các tham số khác nếu cần
  };
</script>
<script src="https://motorbikenguyenha.github.io/hanoi/motoai_v40_right_fixed.js" async></script>

Nếu file JS nằm cùng thư mục:
src="motoai_v40_right_fixed.js"

4.2. Mở chat bằng code (CTA, button riêng)

Script đã expose hàm:

window.MotoAI_open = function(initialText) { ... }

Có thể dùng trong HTML:

<button onclick="MotoAI_open('Tôi muốn thuê xe ga 3 ngày ở phố cổ')">
  Chat để hỏi giá
</button>


⸻

5. Lệnh đặc biệt trong khung chat

Người dùng có thể gõ các “lệnh”:
	•	reset / clear / xoá chat / xóa chat / delete chat
→ Xóa lịch sử hội thoại, chatbot chào lại từ đầu.

⸻

6. Thông tin liên hệ & backlink chính cho landing

Trang chính:
👉 Landing: https://motorbikenguyenha.github.io/hanoi/￼

Liên hệ:
	•	📞 Điện thoại / Zalo: +84 33 469 9969
	•	Zalo Chat: https://zalo.me/0334699969￼
	•	✉️ Email: motorbikenguyenha@gmail.com
	•	📍 Địa chỉ: Ngõ 5 Nguyễn Văn Cừ, Long Biên, Hà Nội
	•	Google Maps: https://maps.app.goo.gl/ZyGZA84iYYisGFgt6?g_st=ipc￼

Một số social / backlink chính (dùng cho index + entity brand):
	•	Pinterest: https://www.pinterest.com/rentbikehanoi1/￼
	•	Instagram: https://www.instagram.com/rentbikehanoi/￼
	•	TikTok: https://www.tiktok.com/@rentbikehanoi￼
	•	X (Twitter): https://x.com/Rentbikehanoi1￼
	•	YouTube: https://youtube.com/@rentbikehanoi￼
	•	Behance: https://www.behance.net/rentbikehanoi￼
	•	500px: https://500px.com/p/rentbikehanoi￼
	•	Medium: https://medium.com/@rentbikehanoi￼
	•	Blogspot: https://rentbikehanoi1.blogspot.com/￼
	•	SoundCloud: https://m.soundcloud.com/motorbikenguyenha￼
	•	Reddit: https://www.reddit.com/user/Foreign-Promotion232/￼

Index.html có thể đặt thêm section “Social / Liên hệ” link về những profile này để Google dễ liên kết entity và dùng README này trong repo như tài liệu mô tả hệ thống + backlink nhẹ từ GitHub sang landing.

⸻

7. Gợi ý thêm cho SEO & maintenance
	•	robots.txt:
	•	Khai báo:

User-agent: *
Allow: /

Sitemap: https://motorbikenguyenha.github.io/hanoi/sitemap.xml
Sitemap: https://motorbikenguyenha.github.io/hanoi/social-sitemap.xml


	•	sitemap.xml: liệt kê các page chính:
	•	index.html, about.html, services.html, faq.html, contact.html, terms.html, privacy.html, social.html
	•	social-sitemap.xml: liệt kê link social (Pinterest, IG, TikTok…).
	•	Có thể đặt link GitHub repo vào footer landing như:
	•	View source on GitHub → tăng độ trust kỹ thuật (optional).

⸻

8. Ghi chú triển khai
	•	Script auto chặn double-load bằng:

if (window.MotoAI_v40_LOADED) return;
window.MotoAI_v40_LOADED = true;


	•	Không cần thêm thư viện ngoài (no jQuery, no framework).
	•	Chỉ dùng Web APIs chuẩn:
	•	localStorage, MutationObserver, matchMedia, addEventListener, v.v.
	•	Chạy tốt trên:
	•	Chrome, Edge, Firefox, Safari (desktop & mobile).

Nếu sau này bạn thêm bảng giá mới, dòng xe mới, hoặc muốn tinh chỉnh câu trả lời mặc định, chỉ cần chỉnh trong phần:
	•	PRICE_TABLE
	•	STATIC_QA
	•	fallbackAnswer()

⸻
