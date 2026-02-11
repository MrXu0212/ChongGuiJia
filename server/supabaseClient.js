const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误: 缺少 SUPABASE_URL 或 SUPABASE_ANON_KEY 环境变量');
  process.exit(1);
}

// 创建管理客户端（用于服务端操作）
const supabase = createClient(supabaseUrl, supabaseKey);

// 创建带用户 token 的客户端（用于 RLS）
function createUserClient(accessToken) {
  return createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

module.exports = { supabase, createUserClient, supabaseUrl, supabaseKey };
