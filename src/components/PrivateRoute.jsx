import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * PrivateRoute: 認証済みユーザーのみアクセスを許可するガードコンポーネント
 * 未ログインの場合はログイン画面にリダイレクトする
 */
export default function PrivateRoute({ children }) {
  const { user } = useAuth()

  // user が null（未ログイン）の場合はログイン画面にリダイレクト
  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
