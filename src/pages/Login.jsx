import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ログイン画面
 * メールアドレスとパスワードで Supabase 認証を行う
 */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Supabase の signInWithPassword を呼び出してログインする
    const { error } = await signIn(email, password)

    if (error) {
      // 認証エラーを日本語で表示する
      setError('メールアドレスまたはパスワードが正しくありません')
      setLoading(false)
    } else {
      // ログイン成功後は物件一覧画面に遷移する
      navigate('/properties')
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>不動産管理アプリ</h1>
        <h2 style={styles.subtitle}>ログイン</h2>

        {/* エラーメッセージ表示エリア */}
        {error && <p style={styles.error}>{error}</p>}

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
            <label style={styles.label}>パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワードを入力"
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        <p style={styles.linkText}>
          アカウントをお持ちでない方は{' '}
          <Link to="/register" style={styles.link}>
            会員登録
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
