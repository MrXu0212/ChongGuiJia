const API_BASE = '/api';

// 获取保存的 token
function getToken(): string | null {
    return localStorage.getItem('access_token');
}

// 保存 session 信息
export function saveSession(session: any) {
    if (session?.access_token) {
        localStorage.setItem('access_token', session.access_token);
    }
}

// 清除 session
export function clearSession() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('isLoggedIn');
}

// 通用请求方法
async function request(path: string, options: RequestInit = {}): Promise<any> {
    const token = getToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string> || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || '请求失败');
    }

    return data;
}

// ============ 认证 API ============

export const authApi = {
    register: (email: string, password: string, nickname?: string) =>
        request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, nickname })
        }),

    login: (email: string, password: string) =>
        request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),

    logout: () =>
        request('/auth/logout', { method: 'POST' }),

    getMe: () =>
        request('/auth/me')
};

// ============ 宠物 API ============

export const petsApi = {
    list: (params?: { category?: string; search?: string }) => {
        const query = new URLSearchParams();
        if (params?.category) query.set('category', params.category);
        if (params?.search) query.set('search', params.search);
        const queryStr = query.toString();
        return request(`/pets${queryStr ? `?${queryStr}` : ''}`);
    },

    getById: (id: string) =>
        request(`/pets/${id}`),

    create: (petData: any) =>
        request('/pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        })
};

// ============ 领养申请 API ============

export const applicationsApi = {
    submit: (data: {
        pet_id: string;
        housing_type: string;
        experience: string;
        family_members: string;
        work_schedule: string;
    }) =>
        request('/applications', {
            method: 'POST',
            body: JSON.stringify(data)
        }),

    getMine: () =>
        request('/applications/mine')
};

// ============ 收藏 API ============

export const favoritesApi = {
    list: () =>
        request('/favorites'),

    add: (pet_id: string) =>
        request('/favorites', {
            method: 'POST',
            body: JSON.stringify({ pet_id })
        }),

    remove: (pet_id: string) =>
        request(`/favorites/${pet_id}`, { method: 'DELETE' })
};

// ============ 消息 API ============

export const messagesApi = {
    list: () =>
        request('/messages'),

    send: (data: { receiver_id?: string; content: string; sender_name?: string }) =>
        request('/messages', {
            method: 'POST',
            body: JSON.stringify(data)
        })
};
