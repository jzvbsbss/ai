import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')
  const [model, setModel] = useState('openai')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse('')
    try {
      const res = await axios.post('/api/ask', { message, model })
      setResponse(res.data.reply)
    } catch (err) {
      setResponse('Terjadi kesalahan saat memproses.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-xl mx-auto bg-white shadow-xl p-6 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">Asisten AI Multi-Model</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tulis pertanyaan kamu..."
            className="w-full p-3 border rounded-lg"
            rows={4}
          />
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-2 border rounded-lg"
          >
            <option value="openai">OpenAI</option>
            <option value="deepseek">DeepSeek</option>
            <option value="gemini">Gemini</option>
          </select>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Kirim'}
          </button>
        </form>
        {response && (
          <div className="mt-6 bg-gray-50 p-4 rounded-xl whitespace-pre-wrap">
            <strong>Jawaban:</strong> {response}
          </div>
        )}
      </div>
    </main>
  )
      }
