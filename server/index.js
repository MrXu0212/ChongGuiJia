require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const applicationsRoutes = require('./routes/applications');
const favoritesRoutes = require('./routes/favorites');
const messagesRoutes = require('./routes/messages');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json());

// 请求日志
app.use((req, res, next) => {
    console.log(`${new Date().toLocaleTimeString()} [${req.method}] ${req.path}`);
    next();
});

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/messages', messagesRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: '宠归家后端服务运行正常 🐾' });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: '接口不存在' });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({ error: '服务器内部错误' });
});

app.listen(PORT, () => {
    console.log(`\n🐾 宠归家后端服务已启动`);
    console.log(`📡 地址: http://localhost:${PORT}`);
    console.log(`💚 健康检查: http://localhost:${PORT}/api/health\n`);
});
