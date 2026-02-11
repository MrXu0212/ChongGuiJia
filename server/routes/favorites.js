const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 获取我的收藏列表
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await req.userClient
            .from('favorites')
            .select(`
        *,
        pets (id, name, breed, age, image_url, gender)
      `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ favorites: data || [] });
    } catch (err) {
        console.error('获取收藏列表错误:', err);
        res.status(500).json({ error: '获取收藏列表失败' });
    }
});

// 添加收藏
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { pet_id } = req.body;
        if (!pet_id) {
            return res.status(400).json({ error: '请指定宠物' });
        }

        const { data, error } = await req.userClient
            .from('favorites')
            .insert({ user_id: req.user.id, pet_id })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') {
                return res.status(400).json({ error: '已收藏过该宠物' });
            }
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: '收藏成功', favorite: data });
    } catch (err) {
        console.error('添加收藏错误:', err);
        res.status(500).json({ error: '收藏失败' });
    }
});

// 取消收藏
router.delete('/:petId', authMiddleware, async (req, res) => {
    try {
        const { petId } = req.params;

        const { error } = await req.userClient
            .from('favorites')
            .delete()
            .eq('user_id', req.user.id)
            .eq('pet_id', petId);

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: '已取消收藏' });
    } catch (err) {
        console.error('取消收藏错误:', err);
        res.status(500).json({ error: '取消收藏失败' });
    }
});

module.exports = router;
