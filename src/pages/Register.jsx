import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * 会員登録画面
 * Supabase の signUp でユーザーアカウントを新規作成する
 */
export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // パスワードと確認用パスワードが一致しているかチェック
    if (password !== confirm) {
      setError('パスワードが一致しません')
      return
    }

    if (password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      return
    }

    setLoading(true)

    // Supabase の signUp でアカウントを作成する
    const { data, error } = await signUp(email, password)

    if (error) {
      setError('登録に失敗しました: ' + error.message)
      setLoading(false)
    } else if (data.user && !data.session) {
      // メール確認が必要な場合（Supabase のデフォルト設定）
      setMessage('確認メールを送信しました。メールのリンクをクリックしてアカウントを有効化してください。')
      setLoading(false)
    } else {
      // メール確認不要の場合はそのまま物件一覧に遷移する
      navigate('/properties')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>不動産管理アプリ</h1>
        <h2 style={styles.subtitle}>会員登録</h2>

        {/* エラーメッセージ */}
        {error && <p style={styles.error}>{error}</p>}
        {/* 成功メッセージ（メール確認案内） */}
        {message && <p style={styles.success}>{message}</p>}

        {!message && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>メールアドレス</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>パスワード（6文字以上）</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                required
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>パスワード（確認）</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="パスワードを再入力"
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? '登録中...' : 'アカウントを作成'}
            </button>
          </form>
        )}

        <p style={styles.linkText}>
          すでにアカウントをお持ちの方は{' '}
          <Link to="/login" style={styles.link}>
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2d6a4f',
    textAlign: 'center',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginBottom: '24px',
  },
  error: {
    backgroundColor: '#fff0f0',
    color: '#c0392b',
    border: '1px solid #f5c6c6',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  success: {
    backgroundColor: '#f0fff4',
    color: '#276749',
    border: '1px solid #9ae6b4',
    borderRadius: '6px',
    padding: '10px 14px',
    fontSize: '14px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '10px 14px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#2d6a4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  linkText: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#2d6a4f',
    fontWeight: '600',
    textDecoration: 'none',
  },
}
