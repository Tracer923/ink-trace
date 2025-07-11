import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabaseClient"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const allowedEmail = import.meta.env.VITE_ALLOWED_EMAIL

  const handleSubmit = async () => {
    if (!email || email !== allowedEmail) {
      alert("現状は許可されたユーザーのみ登録可能です")
      return
    }

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      alert(`エラー: ${error.message}`)
    } else {
      alert(isLogin ? "ログイン成功！" : "確認メール送ったよ！")
      if (isLogin) navigate("/")
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">{isLogin ? "ログイン" : "新規登録"}</h1>
      <input
        className="w-full border p-2 rounded text-black"
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded text-black"
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 text-white p-2 rounded"
        onClick={handleSubmit}
      >
        {isLogin ? "ログイン" : "登録"}
      </button>
      <p className="text-center text-sm text-gray-600">
        {isLogin ? "アカウントを持ってない？" : "アカウントを持ってる？"}{" "}
        <button className="underline" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "新規登録へ" : "ログインへ"}
        </button>
      </p>
    </div>
  )
}