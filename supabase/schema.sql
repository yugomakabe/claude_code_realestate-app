-- =====================================================
-- 不動産管理アプリ: properties テーブル定義
-- Supabase ダッシュボード > SQL Editor で実行する
-- =====================================================

-- properties テーブルの作成
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,              -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent >= 0), -- 家賃（円）
  area        TEXT        NOT NULL,              -- エリア名
  floor_plan  TEXT        NOT NULL,              -- 間取り（例: 1LDK）
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW() -- 登録日時
);

-- =====================================================
-- RLS（行レベルセキュリティ）の設定
-- 有効にするだけではポリシーがない限りデータ取得できない
-- =====================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 自分が登録した物件のみ取得できる
CREATE POLICY "自分の物件のみ取得"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- 自分のユーザーIDを紐付けた物件のみ登録できる
CREATE POLICY "自分の物件のみ登録"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できる
CREATE POLICY "自分の物件のみ更新"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できる
CREATE POLICY "自分の物件のみ削除"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
