const express = require('express');
const router = express.Router();
const { supabase } = require('../supabaseClient');
const authMiddleware = require('../middleware/authMiddleware');

// 获取宠物列表 (支持分类和搜索)
router.get('/', async (req, res) => {
    try {
        const { category, search, limit = 20 } = req.query;

        let query = supabase
            .from('pets')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(parseInt(limit));

        if (category && category !== '全部') {
            query = query.eq('category', category);
        }

        if (search) {
            query = query.or(`name.ilike.%${search}%,breed.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ pets: data || [] });
    } catch (err) {
        console.error('获取宠物列表错误:', err);
        res.status(500).json({ error: '获取宠物列表失败' });
    }
});

// 获取宠物详情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: '宠物不存在' });
        }

        res.json({ pet: data });
    } catch (err) {
        console.error('获取宠物详情错误:', err);
        res.status(500).json({ error: '获取宠物详情失败' });
    }
});

// 发布新宠物
router.post('/', authMiddleware, async (req, res) => {
    try {
        const petData = {
            ...req.body,
            created_by: req.user.id
        };

        const { data, error } = await req.userClient
            .from('pets')
            .insert(petData)
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: '发布成功', pet: data });
    } catch (err) {
        console.error('发布宠物错误:', err);
        res.status(500).json({ error: '发布失败' });
    }
});

module.exports = router;
