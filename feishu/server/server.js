import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
app.use(cors({
    origin: "http://127.0.0.1:3000", // 只允许 3000 端口的前端请求
    credentials: true
}));
app.use(bodyParser.json());

const APP_ID = "cli_a85cdbee0ff8d013";       // 替换成飞书应用的
const APP_SECRET = "ICJCaWXIjkmCAGPsN8pXBbNDVj6kG0oz"; // 替换成飞书应用的

// 处理 code -> access_token
app.post("/api/auth/feishu", async (req, res) => {
    const { code } = req.body;
    console.log(code, 'code===');
    try {
        const tokenRes = await fetch("https://open.feishu.cn/open-apis/authen/v1/access_token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "authorization_code",
                code,
                app_id: APP_ID,
                app_secret: APP_SECRET,
            }),
        });

        const tokenData = await tokenRes.json();
        console.log("tokenData", tokenData);

        if (!tokenData.data) {
            return res.status(400).json(tokenData);
        }

        res.json(tokenData.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "飞书鉴权失败" });
    }
});

// 启动后端
app.listen(4000, () => {
    console.log("✅ Server running on http://localhost:3000");
});
