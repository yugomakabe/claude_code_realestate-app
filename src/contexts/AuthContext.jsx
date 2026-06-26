import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

// 認証情報を共有するためのコンテキストを作成
const AuthContext = createContext(null)

/**
 * AuthProvider: アプリ全体に認証状態を提供するラッパーコンポーネント
 * Supabase の onAuthStateChange でセッション変化をリアルタイムに監視する
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // セッション確認中はローディング状態にして画面のちらつきを防ぐ
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 初回マウント時に現在のセッションを取得する
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // ログイン・ログアウト・トークン更新などの認証状態変化を購読する
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    // コンポーネントのアンマウント時に購読を解除してメモリリークを防ぐ
    return () => subscription.unsubscribe()
  }, [])

  const value = {
    user,
    loading,
    // メールアドレス＋パスワードでサインアップ
    signUp: (email, password) =>
      supabase.auth.signUp({ email, password }),
    // メールアドレス＋パスワードでサインイン
    signIn: (email, password) =>
      supabase.auth.signInWithPassword({ email, password }),
    // サインアウト
    signOut: () => supabase.auth.signOut(),
  }

  return (
    <AuthContext.Provider value={value}>
      {/* ローディング中は何も表示しない（セッション確認待ち） */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// 各コンポーネントで認証情報を手軽に取得するためのカスタムフック
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth は AuthProvider の内側で使用してください')
  }
  return context
}
