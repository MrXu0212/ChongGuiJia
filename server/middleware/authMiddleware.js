const { createUserClient } = require('../supabaseClient');

/**
 * 鉴权中间件：解析 Authorization header 中的 Bearer token，
 * 验证用户身份，并将 userClient 和 user 挂载到 req 上。
 */
async function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: '请先登录' });
    }

    try {
        const userClient = createUserClient(token);
        const { data: { user }, error } = await userClient.auth.getUser();

        if (error || !user) {
            return res.status(401).json({ error: '登录已过期' });
        }

        // 挂载到 req 上，后续路由可直接使用
        req.userClient = userClient;
        req.user = user;
        next();
    } catch (err) {
        console.error('鉴权失败:', err);
        return res.status(401).json({ error: '身份验证失败' });
    }
}

module.exports = authMiddleware;
