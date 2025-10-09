import './App.css'
import ScreenRecorder from "./components/ScreenRecorder.tsx";

function App() {
    const appId = ""; // 替换
    // const redirectUri = encodeURIComponent("http://127.0.0.1:3000"); // Vite 默认端口 5173
    const redirectUri = "http://127.0.0.1:3000";

    // 点击登录按钮 -> 跳转飞书授权
    const handleLogin = () => {
        const url = `https://open.feishu.cn/open-apis/authen/v1/index?app_id=${appId}&redirect_uri=${redirectUri}`;
        window.location.href = url;
    };

    // 获取 URL 上的 code
    const getCodeFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get("code");
    };

    const code = getCodeFromUrl();

    // 前端把 code 传给后端
    const handleSendCode = async () => {
        if (!code) {
            alert("没有获取到 code");
            return;
        }
        const res = await fetch("http://localhost:4000/api/auth/feishu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
        });
        const data = await res.json();
        console.log("用户信息:", data);
        alert("登录成功，打开控制台看信息");
    };

    return (
        <>
            <div>
                <h2>飞书鉴权</h2>
                <a href={`https://open.feishu.cn/open-apis/authen/v1/index?app_id=${appId}&redirect_uri=${redirectUri}`} target={'_blank'}>使用飞书登录</a>
                {code && (
                    <div>
                        <p>已获取到 code: {code}</p>
                        <button onClick={handleSendCode}>发送 code 到后端换取用户信息</button>
                    </div>
                )}
            </div>
        </>
    )
}

export default App
