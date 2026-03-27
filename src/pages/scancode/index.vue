<template>
   <div class="qr-scanner">
        <!-- 扫码区域 -->
        <div id="qr-reader" ref="readerRef" class="reader"></div>

        <!-- 控制面板 -->
        <div v-if="showControls" class="controls">
            <!-- 闪光灯 -->
            <button v-if="supportsTorch" @click="toggleTorch" class="control-btn" :class="{ active: isTorchOn }">
                🔦 {{ isTorchOn ? '关闭' : '开启' }} 闪光灯
            </button>

            <!-- 变焦滑块 -->
            {{ supportsZoom }}
            <div v-if="supportsZoom" class="zoom-control">
                <label>变焦: {{ currentZoom.toFixed(1) }}x</label>
                <input type="range" :min="minZoom" :max="maxZoom" :step="0.1" v-model.number="currentZoom"
                    @input="applyZoom" class="zoom-slider" />
            </div>
        </div>
       <!-- 提示 -->
        <div v-else class="hint">
            正在启动摄像头...
        </div>
   </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'

// Props / Emits
const props = defineProps<{
    fps?: {
        type: number,
        default: 10
    }
    qrboxSize?: {
        type: number,
        default: 250
    }
    onScanSuccess?: (text: string) => void
}>()

const emit = defineEmits<{
    (e: 'scan', text: string): void
}>()

// refs
const readerRef = ref<HTMLDivElement | null>(null)
let html5QrCode: Html5Qrcode | null = null

// 状态
const showControls = ref(false)
const videoTrack = ref<MediaStreamTrack | null>(null)

// 闪光灯
const supportsTorch = ref(false)
const isTorchOn = ref(false)

// 变焦
const supportsZoom = ref(false)
const minZoom = ref(1.0)
const maxZoom = ref(4.0)
const currentZoom = ref(1.0)

// 启动扫码
const startScanner = async () => {
    if (!readerRef.value) return

    try {
        html5QrCode = new Html5Qrcode(readerRef.value.id || 'qr-reader')

        const config = {
            fps: props.fps || 10,
            qrbox: { width: props.qrboxSize || 250, height: props.qrboxSize || 250 },
            aspectRatio: 1.7777778,
            disableFlip: false
        }

        await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
                emit('scan', decodedText)
                props.onScanSuccess?.(decodedText)
            },
            (errorMessage) => {
                console.warn('扫码错误:', errorMessage)
            }
        )

        // ✅ 关键：从 DOM 获取 video 元素以提取 stream
        await nextTick()
        const video = readerRef.value.querySelector('video')
        if (video && video.srcObject instanceof MediaStream) {
            const stream = video.srcObject
            const tracks = stream.getVideoTracks()
            if (tracks.length > 0) {
                videoTrack.value = tracks[0]
                initCameraControls()
                showControls.value = true
            }
        }
    } catch (err) {
        console.error('启动扫码失败:', err)
        alert('无法访问摄像头，请确保使用 HTTPS 并授予权限')
    }
}

// 初始化摄像头控制（torch / zoom）
const initCameraControls = () => {
    if (!videoTrack.value) return

    const caps = videoTrack.value.getCapabilities()

    // 闪光灯
    if ('torch' in caps) {
        supportsTorch.value = true
    }

    // 变焦
    if (caps.zoom) {
        supportsZoom.value = true
        minZoom.value = caps.zoom.min || 1.0
        maxZoom.value = caps.zoom.max || 4.0
        currentZoom.value = caps.zoom.current !== undefined ? caps.zoom.current : minZoom.value
    }
}

// 切换闪光灯
const toggleTorch = async () => {
    if (!videoTrack.value) return

    isTorchOn.value = !isTorchOn.value
    try {
        await videoTrack.value.applyConstraints({
            advanced: [{ torch: isTorchOn.value }]
        })
    } catch (err) {
        console.error('闪光灯控制失败:', err)
        isTorchOn.value = false
        alert('无法控制闪光灯')
    }
}

// 应用变焦
const applyZoom = async () => {
    if (!videoTrack.value || !supportsZoom.value) return

    try {
        await videoTrack.value.applyConstraints({
            advanced: [{ zoom: currentZoom.value }]
        })
    } catch (err) {
        console.error('变焦失败:', err)
    }
}

// 生命周期
onMounted(() => {
    startScanner()
})

onUnmounted(() => {
    if (html5QrCode) {
        html5QrCode.stop().catch(console.warn)
        html5QrCode.clear()
    }
})
</script>

<style scoped>
.qr-scanner {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    position: relative;
}

.reader {
    width: 100%;
        background: #000;
        border-radius: 8px;
        overflow: hidden;
    

.controls {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 0 10px;
    }

.control-btn {
    padding: 10px 16px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.control-btn.active {
    background: #f0f0ff;
    border-color: #666;
}

.zoom-control {
    display: flex;
    flex-direction: column;
        gap: 6px;
    }
.zoom-slider {
    width: 100%;
    height: 24px;
    -webkit-appearance: none;
    background: #eee;
    border-radius: 12px;
    outline: none;
}
.zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #409eff;
        cursor: pointer;
    }
.hint {
    text-align: center;
    color: #888;
    padding: 20px;
}
}
</style>