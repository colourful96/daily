import { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function ScreenRecorder() {
    const [recording, setRecording] = useState(false);
    const [ffmpegLoaded, setFfmpegLoaded] = useState(false);
    const [webmURL, setWebmURL] = useState<string | null>(null);
    const [webmBlob, setWebmBlob] = useState<Blob | null>(null);
    const [mp4URL, setMp4URL] = useState<string | null>(null);
    const [converting, setConverting] = useState(false);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const ffmpegRef = useRef(new FFmpeg());

    // 加载 ffmpeg.wasm
    const loadFfmpeg = async () => {
        try {
            const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core-mt@0.12.10/dist/esm";
            const ffmpeg = ffmpegRef.current;

            // 添加日志监听
            ffmpeg.on('log', ({ message }) => {
                console.log('FFmpeg log:', message);
            });

            ffmpeg.on('progress', ({ progress, time }) => {
                console.log(`转换进度: ${(progress * 100).toFixed(2)}%`, time);
            });

            await ffmpeg.load({
                coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
                wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
                workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
            });
            setFfmpegLoaded(true);
            console.log("FFmpeg 加载成功");
        } catch (error) {
            console.error("FFmpeg 加载失败:", error);
            alert("FFmpeg 加载失败，请检查网络连接");
        }
    };

    // 开始录屏
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: 30,
                    width: 1920,
                    height: 1080
                },
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    sampleRate: 44100
                }
            });

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp9,opus',
                videoBitsPerSecond: 2500000 // 2.5 Mbps
            });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                setWebmURL(url);
                setWebmBlob(blob);

                // 停止所有轨道
                stream.getTracks().forEach(track => track.stop());
            };

            // 处理用户提前结束共享
            stream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            mediaRecorder.start(1000); // 每1秒收集一次数据
            setRecording(true);
        } catch (err) {
            console.error("开始录屏失败:", err);
            alert("获取屏幕失败，请确认已允许权限");
        }
    };

    // 停止录屏
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };

    // 将录屏的 WebM 转换为 MP4
    const convertToMp4 = async () => {
        if (!webmBlob || !ffmpegLoaded) {
            alert("请先完成录屏并确保 FFmpeg 已加载");
            return;
        }

        setConverting(true);
        try {
            const ffmpeg = ffmpegRef.current;

            // 使用 webmBlob 而不是 webmURL
            const inputData = await fetchFile(webmBlob);
            await ffmpeg.writeFile("input.webm", inputData);

            console.log("开始转换 WebM 到 MP4...");

            // 使用更兼容的转换参数
            await ffmpeg.exec([
                '-i', 'input.webm',
                '-c:v', 'libx264',       // 视频编码器
                '-preset', 'medium',     // 编码速度与质量的平衡
                '-crf', '23',           // 质量参数 (0-51, 越低质量越好)
                '-c:a', 'aac',          // 音频编码器
                '-b:a', '128k',         // 音频比特率
                '-movflags', '+faststart', // 优化网络播放
                '-y',                   // 覆盖输出文件
                'output.mp4'
            ]);

            const data = await ffmpeg.readFile('output.mp4');
            const mp4Blob = new Blob([data], { type: 'video/mp4' });
            const mp4Url = URL.createObjectURL(mp4Blob);

            setMp4URL(mp4Url);
            console.log("转换成功!");

            // 清理临时文件
            await ffmpeg.deleteFile('input.webm');
            await ffmpeg.deleteFile('output.mp4');

        } catch (error) {
            console.error("转换失败:", error);
            alert("转换失败，请查看控制台了解详情");
        } finally {
            setConverting(false);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            {!ffmpegLoaded ? (
                <button onClick={loadFfmpeg}>加载 FFmpeg</button>
            ) : (
                <>
                    {!recording ? (
                        <button onClick={startRecording}>开始录屏</button>
                    ) : (
                        <button onClick={stopRecording}>停止录屏</button>
                    )}

                    {webmURL && (
                        <div style={{ marginTop: 20 }}>
                            <h3>WebM 预览</h3>
                            <video
                                ref={videoRef}
                                src={webmURL}
                                controls
                                width="400"
                                onLoadedMetadata={() => console.log("WebM 视频已加载")}
                            />
                            <div style={{ marginTop: 10 }}>
                                <button
                                    onClick={convertToMp4}
                                    disabled={converting}
                                >
                                    {converting ? "转换中..." : "转换为 MP4"}
                                </button>
                            </div>
                        </div>
                    )}

                    {mp4URL && (
                        <div style={{ marginTop: 20 }}>
                            <h3>MP4 预览</h3>
                            <video src={mp4URL} controls width="400" />
                            <a href={mp4URL} download="recorded.mp4">
                                <button style={{ marginTop: 10 }}>下载 MP4</button>
                            </a>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ScreenRecorder;