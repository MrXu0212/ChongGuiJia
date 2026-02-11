const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// 提交领养申请
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { pet_id, housing_type, experience, family_members, work_schedule } = req.body;

        if (!pet_id) {
            return res.status(400).json({ error: '请指定宠物' });
        }

        const { data, error } = await req.userClient
            .from('applications')
            .insert({
                user_id: req.user.id,
                pet_id,
                housing_type: housing_type || '',
                experience: experience || '',
                family_members: family_members || '',
                work_schedule: work_schedule || '',
                status: '待审核'
            })
            .select()
            .single();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ message: '领养申请提交成功！', application: data });
    } catch (err) {
        console.error('提交申请错误:', err);
        res.status(500).json({ error: '提交申请失败' });
    }
});

// 获取我的申请列表
router.get('/mine', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await req.userClient
            .from('applications')
            .select(`
        *,
        pets (id, name, breed, age, image_url)
      `)
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ applications: data || [] });
    } catch (err) {
        console.error('获取申请列表错误:', err);
        res.status(500).json({ error: '获取申请列表失败' });
    }
});

module.exports = router;
