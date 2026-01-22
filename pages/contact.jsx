// pages/contact.jsx
import { useState } from "react";
import Head from "next/head";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "精品包購買", // 預設選項
    message: "",
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", msg: "" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        setStatus({
          type: "success",
          msg: "您的訊息已發送，我們會盡快聯繫您！",
        });
        setFormData({ name: "", email: "", service: "建立頁面", message: "" });
      } else {
        setStatus({
          type: "error",
          msg: "發送失敗，請稍後再試或透過 LINE 聯繫我們。",
        });
      }
    } catch (error) {
      setStatus({ type: "error", msg: "發生錯誤，請檢查網路連線。" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="container  my-20 mx-auto">
      <Head>
        <title>聯繫凱仕 Contact KÉSH de¹</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="main-content flex justify-center !border">
        {/* 左側：品牌資訊區 */}
        <section className="info-section">
          <h1 className="title">Contact CIÉMAN</h1>
          <p className="subtitle">讓我們聊聊您的專案需求</p>

          <div className="contact-details">
            <div className="detail-item">
              <span className="label">客服時間</span>
              <span className="value">13:00 – 20:00</span>
            </div>

            <div className="detail-item">
              <span className="label">Email</span>
              <a href="mailto:hello.cieman@gmail.com" className="value link">
                hello.cieman@gmail.com
              </a>
            </div>

            <div className="detail-item">
              <span className="label">Instagram</span>
              <a
                href="https://instagram.com/hello.cieman"
                target="_blank"
                rel="noreferrer"
                className="value link"
              >
                @hello.cieman
              </a>
            </div>

            <div className="cta-box">
              <p className="cta-text">想獲得最即時的回覆？</p>
              <a
                href="https://line.me/R/ti/p/@your_line_id"
                target="_blank"
                rel="noreferrer"
                className="line-button"
              >
                LINE ｜ 立即詢問
              </a>
            </div>
          </div>
        </section>

        {/* 右側：線上表單 */}
        <section className="form-section">
          <form onSubmit={handleSubmit} className="contact-form">
            <h2 className="form-title">線上需求表單</h2>

            <div className="form-group">
              <label htmlFor="name">您的稱呼 / 公司名稱</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="例如：陳先生 / 喜曼設計"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">聯絡信箱</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">需求類別</label>
              <div className="select-wrapper">
                <select
                  name="service"
                  id="service"
                  value={formData.service}
                  onChange={handleChange}
                >
                  <option value="二手精品包購買">
                    精品包購買 (Buy Pre-owned Bags)
                  </option>
                  <option value="寄賣相關諮詢">
                    寄賣相關諮詢 (Consignment)
                  </option>
                  <option value="其他合作">其他合作 (Other)</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="message">詳細訊息</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="請簡述您的需求內容..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "傳送中..." : "確認送出"}
            </button>

            {status.msg && (
              <div className={`status-message ${status.type}`}>
                {status.msg}
              </div>
            )}
          </form>
        </section>
      </main>

      {/* 樣式設定 (Styled JSX) */}
      <style jsx>{`
        /* 全域重置與字型 */
        :global(body) {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
        }

        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
        }

        .main-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: #ffffff;
          max-width: 1000px;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
          border-radius: 12px;
          overflow: hidden;
        }

        /* 左側資訊欄 */
        .info-section {
          background-color: #1a1a1a;
          color: #fff;
          padding: 60px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .title {
          font-size: 32px;
          margin: 0 0 10px 0;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .subtitle {
          font-size: 16px;
          color: #888;
          margin-bottom: 40px;
          font-weight: 300;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 12px;
          text-transform: uppercase;
          color: #666;
          letter-spacing: 1px;
          margin-bottom: 5px;
        }

        .value {
          font-size: 16px;
          color: #fff;
          text-decoration: none;
        }

        .link:hover {
          color: #ccc;
          transition: color 0.2s;
        }

        .cta-box {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #333;
        }

        .cta-text {
          font-size: 14px;
          color: #888;
          margin-bottom: 15px;
        }

        .line-button {
          display: inline-block;
          background-color: #06c755;
          color: white;
          padding: 12px 24px;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          font-size: 14px;
          transition: background 0.2s;
          text-align: center;
        }

        .line-button:hover {
          background-color: #05b34c;
        }

        /* 右側表單欄 */
        .form-section {
          padding: 60px;
          background-color: #fff;
        }

        .form-title {
          font-size: 24px;
          margin-bottom: 30px;
          color: #1a1a1a;
        }

        .form-group {
          margin-bottom: 24px;
        }

        label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #333;
        }

        input,
        textarea,
        select {
          width: 100%;
          padding: 12px 15px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 15px;
          background-color: #fcfcfc;
          transition: border-color 0.2s;
          box-sizing: border-box; /* 確保 padding 不會撐大寬度 */
        }

        input:focus,
        textarea:focus,
        select:focus {
          outline: none;
          border-color: #1a1a1a;
          background-color: #fff;
        }

        .select-wrapper {
          position: relative;
        }

        .submit-btn {
          width: 100%;
          padding: 15px;
          background-color: #1a1a1a;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
          margin-top: 10px;
        }

        .submit-btn:hover {
          opacity: 0.9;
        }

        .submit-btn:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }

        .status-message {
          margin-top: 20px;
          padding: 10px;
          border-radius: 4px;
          font-size: 14px;
          text-align: center;
        }

        .status-message.success {
          background-color: #d4edda;
          color: #155724;
        }

        .status-message.error {
          background-color: #f8d7da;
          color: #721c24;
        }

        /* 響應式設計 */
        @media (max-width: 768px) {
          .main-content {
            grid-template-columns: 1fr;
          }

          .info-section {
            padding: 40px;
            order: 2; /* 手機版讓資訊在下方，表單在上方，或者根據喜好調整 */
          }

          .form-section {
            padding: 40px;
            order: 1;
          }
        }
      `}</style>
    </div>
  );
}
