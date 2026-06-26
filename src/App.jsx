import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Properties from './pages/Properties'

/**
 * App: アプリケーションのルートコンポーネント
 * AuthProvider でアプリ全体を囲み、全コンポーネントから認証情報にアクセスできるようにする
 *
 * ルーティング構成:
 *   /login      → ログイン画面（未ログイン時のみ）
 *   /register   → 会員登録画面
 *   /properties → 物件一覧（PrivateRoute で認証必須）
 *   /          → /properties へリダイレクト
 */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ルートへのアクセスは物件一覧にリダイレクト */}
          <Route path="/" element={<Navigate to="/properties" replace />} />

          {/* 認証不要のページ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 認証必須のページ：PrivateRoute でガードする */}
          <Route
            path="/properties"
            element={
              <PrivateRoute>
                <Properties />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
