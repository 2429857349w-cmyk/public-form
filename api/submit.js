const { createClient } = require('@supabase/supabase-js');

// 从环境变量获取Supabase配置
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('请在Vercel中配置SUPABASE_URL和SUPABASE_KEY！');
}

// 初始化Supabase客户端
const supabase = createClient(supabaseUrl, supabaseKey);

// 处理POST请求
module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: '仅支持POST方法' });
    }

    try {
        const formData = req.body;
        // 添加提交时间戳
        formData.submittedAt = new Date().toLocaleString();
        // 保存数据到Supabase表格
        const { error } = await supabase
            .from('submissions') // 表格名必须和SQL创建的一致
            .insert([formData]);

        if (error) throw error;
        res.status(200).json({ status: 'success', message: '数据已保存' });
    } catch (err) {
        console.error('保存失败：', err);
        res.status(500).json({ error: '保存数据失败，请重试' });
    }
};
