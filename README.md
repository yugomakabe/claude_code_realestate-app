# realestate-app

認証・データベース・OAuth の学習を目的とした不動産管理 Web アプリ。

## 概要

Supabase の認証機能とデータベースを活用し、物件情報の登録・閲覧・編集・削除ができる Web アプリです。

## 本番 URL

https://claude-code-realestate-app.vercel.app/

## 技術スタック

| 領域 | 技術 |
|------|------|
| フロントエンド | React + Vite |
| 認証 | Supabase Auth（メール/パスワード） |
| データベース | Supabase（PostgreSQL） |
| セキュリティ | Row Level Security（RLS） |
| デプロイ | Vercel |

## 機能

- メールアドレス＋パスワードによる会員登録・ログイン・ログアウト
- 未ログイン時はログイン画面にリダイレクト
- 物件の一覧表示・新規登録・編集・削除（CRUD）
- RLS により自分が登録した物件のみ操作可能

## ディレクトリ構成

```
realestate-app/
├── public/
├── src/
│   ├── components/
│   │   ├── PrivateRoute.jsx   # 認証ガード
│   │   └── PropertyForm.jsx   # 物件登録・編集フォーム
│   ├── contexts/
│   │   └── AuthContext.jsx    # 認証状態管理
│   ├── pages/
│   │   ├── Login.jsx          # ログイン画面
│   │   ├── Register.jsx       # 会員登録画面
│   │   └── Properties.jsx     # 物件一覧画面（CRUD）
│   ├── App.jsx                # ルーティング
│   ├── main.jsx               # エントリポイント
│   └── supabase.js            # Supabase クライアント
├── supabase/
│   └── schema.sql             # テーブル定義・RLS ポリシー
├── .env.example               # 環境変数テンプレート
├── vercel.json                # Vercel SPA ルーティング設定
└── CLAUDE.md                  # AI エージェント向けプロジェクト情報
```

## ローカル開発

### 必要なもの

- Node.js 18 以上
- Supabase アカウント

### セットアップ

```bash
# 依存パッケージのインストール
npm install

# 環境変数の設定
cp .env.example .env
# .env を編集して Supabase の URL と Anon Key を入力する

# 開発サーバーの起動
npm run dev
```

### Supabase テーブルの作成

Supabase ダッシュボードの SQL Editor で `supabase/schema.sql` を実行してください。

## 環境変数

| 変数名 | 説明 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase プロジェクトの URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase の Publishable Key |
