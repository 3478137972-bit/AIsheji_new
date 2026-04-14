-- Supabase 数据库初始化脚本
-- 在 Supabase 控制台的 SQL Editor 中执行此脚本

-- 1. 创建 user_points 表
CREATE TABLE IF NOT EXISTS user_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- 2. 创建索引
CREATE INDEX IF NOT EXISTS idx_user_points_user_id ON user_points(user_id);

-- 3. 启用 RLS (Row Level Security)
ALTER TABLE user_points ENABLE ROW LEVEL SECURITY;

-- 4. 创建 RLS 策略 - 用户只能访问自己的积分
CREATE POLICY "Users can view own points"
  ON user_points FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own points"
  ON user_points FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own points"
  ON user_points FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. 创建自动更新 updated_at 的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_points_updated_at
  BEFORE UPDATE ON user_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 6. 新用户注册时自动创建积分记录（可选）
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_points (user_id, points)
  VALUES (NEW.id, 100); -- 新用户默认赠送 100 积分
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
