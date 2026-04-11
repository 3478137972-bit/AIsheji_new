import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户积分接口
export interface UserPoints {
  user_id: string;
  points: number;
  created_at: string;
  updated_at: string;
}

// 获取用户积分
export async function getUserPoints(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_points')
    .select('points')
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return 0;
  }

  return data.points;
}

// 更新用户积分
export async function updateUserPoints(userId: string, points: number): Promise<void> {
  await supabase
    .from('user_points')
    .upsert({
      user_id: userId,
      points: points,
      updated_at: new Date().toISOString(),
    });
}
