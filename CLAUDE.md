# realestate-app

認証・データベース・OAuth の学習を目的とした不動産管理アプリ。

## 目的

- JWT / セッション認証の実装を学ぶ
- OAuth 2.0（Google・GitHub 等）のソーシャルログインを実装する
- RDB（PostgreSQL / SQLite）とのやり取りを ORM 経由で学ぶ
- 実用的なアプリを通じて上記技術を組み合わせる

## 技術スタック（予定）

詳細は実装開始時に確定する。

| 領域 | 候補 |
|------|------|
| バックエンド | Python (FastAPI / Django) |
| 認証 | JWT, OAuth 2.0 |
| DB | PostgreSQL または SQLite |
| ORM | SQLAlchemy / Django ORM |
| フロントエンド | 未定 |

## ディレクトリ構成（予定）

```
realestate-app/
├── CLAUDE.md
├── README.md
├── backend/
│   ├── app/
│   │   ├── auth/       # 認証・OAuth 関連
│   │   ├── models/     # DB モデル
│   │   ├── routers/    # API ルーター
│   │   └── schemas/    # Pydantic スキーマ
│   └── tests/
├── frontend/           # フロントエンド（後日追加）
└── docker-compose.yml
```

## 開発方針

- 学習目的のため、各機能にコメントで仕組みを説明する
- 環境変数は `.env` で管理し、`.env.example` をリポジトリに含める
- シークレット情報（`.env`）は `.gitignore` で除外する

## セットアップ（後日記載）

実装開始後に更新する。
