export default async function handler(req, res) {
  const { message, model } = req.body

  if (!message || !model) {
    return res.status(400).json({ reply: "Permintaan tidak lengkap." })
  }

  try {
    let reply = "Model tidak ditemukan."

    if (model === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }]
        })
      })
      const data = await response.json()
      reply = data.choices?.[0]?.message?.content || "Tidak ada jawaban."
    }

    if (model === "deepseek") {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: message }]
        })
      })
      const data = await response.json()
      reply = data.choices?.[0]?.message?.content || "Tidak ada jawaban."
    }

    if (model === "gemini") {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        })
      })
      const data = await response.json()
      reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban."
    }

    return res.status(200).json({ reply })
  } catch (error) {
    return res.status(500).json({ reply: "Terjadi kesalahan server." })
  }
}