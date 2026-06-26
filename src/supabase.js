import { createClient } from '@supabase/supabase-js'

// 環境変数から Supabase の接続情報を読み込む
// .env ファイルに VITE_SUPABASE_URL と VITE_SUPABASE_ANON_KEY を設定すること
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase クライアントのシングルトンインスタンスを作成してエクスポート
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
