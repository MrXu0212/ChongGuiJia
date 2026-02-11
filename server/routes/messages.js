const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 获取消息列表
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await req.userClient
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${req.user.id},receiver_id.eq.${req.user.id}`)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        // 按联系人分组，取最新消息
        const chatMap = new Map();
        (data || []).forEach(msg => {
            const partnerId = msg.sender_id === req.user.id ? msg.receiver_id : msg.sender_id;
            const key = partnerId || msg.sender_name;
            if (!chatMap.has(key)) {
                chatMap.set(key, {
                    id: msg.id,
                    partner_id: partnerId,
                    sender_name: msg.sender_name,
                    sender_avatar: msg.sender_avatar,
                    last_message: msg.content,
                    time: msg.created_at,
                    unread: msg.receiver_id === req.user.id && !msg.is_read ? 1 : 0
                });
            } else {
                const existing = chatMap.get(key);
                if (!msg.is_read && msg.receiver_id === req.user.id) {
                    existing.unread += 1;
                }
            }
        });

        res.json({ chats: Array.from(chatMap.values()) });
    } catch (err) {
        console.error('获取消息列表错误:', err);
        res.status(500).json({ error: '获取消息列表失败' });
    }
});

// 发送消息
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { receiver_id, content, sender_name, sender_avatar } = req.body;

        const { data, error } = await req.userClient
            .from('messages')
            .insert({
                sender_id: req.user.id,
                receiver_id,
                content,
                sender_name: sender_name || '用户',
                sender_avatar: sender_avatar || ''
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: '发送成功', data });
    } catch (err) {
        console.error('发送消息错误:', err);
        res.status(500).json({ error: '发送消息失败' });
    }
});

module.exports = router;
