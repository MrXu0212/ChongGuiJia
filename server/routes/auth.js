const express = require('express');
const router = express.Router();
const { supabase, createUserClient } = require('../supabaseClient');

// 注册
router.post('/register', async (req, res) => {
    try {
        const { email, password, nickname } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码不能为空' });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { nickname: nickname || '新用户' }
            }
        });

        if (error) {
            console.error('Supabase注册错误:', error.message);
            return res.status(400).json({ error: error.message });
        }

        // Supabase 开启邮箱验证时，session 为 null
        if (!data.session) {
            return res.json({
                message: '注册成功！请查收邮箱验证链接后再登录',
                needEmailConfirm: true,
                user: data.user
            });
        }

        res.json({
            message: '注册成功',
            user: data.user,
            session: data.session
        });
    } catch (err) {
        console.error('注册错误:', err);
        res.status(500).json({ error: '注册失败' });
    }
});

// 登录
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码不能为空' });
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.error('Supabase登录错误:', error.message, '| 状态:', error.status);

            // 区分不同错误类型
            if (error.message.includes('Email not confirmed')) {
                return res.status(401).json({ error: '邮箱尚未验证，请检查您的邮箱并点击验证链接' });
            }
            if (error.message.includes('Invalid login credentials')) {
                return res.status(401).json({ error: '邮箱或密码错误' });
            }
            return res.status(401).json({ error: error.message });
        }

        res.json({
            message: '登录成功',
            user: data.user,
            session: data.session
        });
    } catch (err) {
        console.error('登录错误:', err);
        res.status(500).json({ error: '登录失败' });
    }
});

// 登出
router.post('/logout', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
            const userClient = createUserClient(token);
            await userClient.auth.signOut();
        }
        res.json({ message: '已退出登录' });
    } catch (err) {
        console.error('登出错误:', err);
        res.status(500).json({ error: '登出失败' });
    }
});

// 获取当前用户信息
router.get('/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: '未登录' });
        }

        const userClient = createUserClient(token);
        const { data: { user }, error } = await userClient.auth.getUser();

        if (error || !user) {
            return res.status(401).json({ error: '登录已过期' });
        }

        // 获取用户资料
        const { data: profile } = await userClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        res.json({
            user: {
                id: user.id,
                email: user.email,
                nickname: profile?.nickname || '新用户',
                avatar_url: profile?.avatar_url || '',
                phone: profile?.phone || '',
                created_at: profile?.created_at || user.created_at
            }
        });
    } catch (err) {
        console.error('获取用户信息错误:', err);
        res.status(500).json({ error: '获取用户信息失败' });
    }
});

module.exports = router;
