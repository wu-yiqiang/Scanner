<template>
  <div class="Scanner">
    <LogoTitle title="Scanner" />
    <div class="scan">
      <div class="border">
        <div class="line"></div>
        <div id="reader" ref="readerRef" class="reader" />
      </div>
    </div>
    <div v-if="supportsTorch" @click="toggleTorch">
      <SvgIcon v-if="isTorchOn" name="on" size="40px" />
      <SvgIcon v-else name="off" size="40px" />
    </div>
    <div class="slide">
      <Slider v-if="zoomMax" v-model="zoom" :min="zoomMin" :step="0.1" :max="zoomMax" :format="format"
        @update="applyZoom" />
    </div>
    <div class="tool-bar">
      <!-- {{ cameras }} -->
      <div class="records">
        <SvgIcon name="history" color="#fff" size="40px" @click="openHistoryRecord" />
        <div class="circle" v-if="contentLists?.length">{{ contentLists?.length }}</div>
      </div>
      <SvgIcon name="scan" class="qrcode" color="#fff" size="40px" @click="toQrCode" />
      <SvgIcon name="add" color="#fff" size="40px" @click="handleUploadImg" />
      <input id="image-code" accept="image/*" style="display: none" type="file" />
    </div>
    <ScannerContents v-model:open="visible" title="扫码结果" :contents="contents" />
    <HistoryContents v-model:open="show" title="扫码结果" :lists="contentLists" />
  </div>
</template>

<script setup lang="ts">
import Slider from '@vueform/slider'
import '@vueform/slider/themes/default.css'
import SvgIcon from '@/components/SvgIcon.vue'
import Toast from '@/components/Toast/index.ts'
import LogoTitle from '@/components/LogoTitle.vue'
import ScannerContents from './ScannerContents.vue'
import HistoryContents from './HistoryContents.vue'
import { ref, onMounted, nextTick } from 'vue'
import { Html5Qrcode, Html5QrcodeResult } from 'html5-qrcode'
import router from '@/router/index'
import { onBeforeRouteLeave } from 'vue-router'
let html5QrCode = ref<any>(null)
let show = ref(false)
let visible = ref(false)
let contents = ref("")
let contentLists = ref(<any>[])
let zoom = ref(1)
let zoomMin = ref(0)
let zoomMax = ref(0)
const readerRef = ref(null)
const videoTrack = ref<MediaStreamTrack | null>(null)
const supportsTorch = ref(false)
const isTorchOn = ref(false)
const supportsZoom = ref(false)
// let cameras = ref<CameraDevice | null>()
const format = (value: number) => {
  return `${value.toFixed(1)}x`
}
onMounted(() => {
  getCameras()
})

onBeforeRouteLeave(() => {
  stop()
})
const cameraId = ref('')
const handleZoom = async () => {
  await stop()
  await start()
}
let datas = ref(0)
let touch = ref(false)
const getCameras = async () => {
  const devices = await Html5Qrcode?.getCameras()
    .catch((err) => {
      Toast.error(`获取设备信息失败${err}`)
    })
  if (devices && devices.length) {
    // Toast.success(`cam:${JSON.stringify(devices)}`, 0)
    cameraId.value = devices[1]?.id;
    html5QrCode.value = new Html5Qrcode('reader')
    await start()
    const data = html5QrCode.value.getRunningTrackCameraCapabilities()
    const torch = data.torchFeature()?.isSupported()
    touch.value = torch ?? false
    const devicesInfo = data.zoomFeature()?.isSupported() && data.zoomFeature()?.getCapabilities()
    datas.value = devicesInfo
    zoomMax.value = devicesInfo?.max ?? 0
    zoomMin.value = devicesInfo?.min ?? 0
  }
}
const start = async () => {
  await html5QrCode.value
    ?.start(
      { facingMode: { exact: "environment" } },
      // cameraId.value,
      {
        fps: 80, qrbox: { width: 220, height: 220 },
        aspectRatio: 1,
        videoConstraints: {
          zoom: zoom.value,
          facingMode: 'environment'
        }
      },
      (decodedText: string, decodedResult: Html5QrcodeResult) => {
        openDialog(decodedText)
        openHistoryDialog(decodedText)
        console.log("decodedResult", decodedResult)
      }
    )
    .catch((err: string) => {
      Toast.error(`Unable to start scanning, error: ${err}`)
    })
  nextTick(() => {
    const video = readerRef.value?.querySelector('video')
    if (video && video.srcObject instanceof MediaStream) {
      const stream = video.srcObject
      const tracks = stream.getVideoTracks()
      if (tracks.length > 0) {
        videoTrack.value = tracks[0]
        initCameraControls()
      }
    }
  })

}
const stop = async () => {
  if (html5QrCode?.value) {
    await html5QrCode.value
      .stop()
      .then((ignore: string) => {
        console.log(ignore)
      })
      .catch((err: string) => {
        Toast.error(`Unable to stop scanning.\n${err}`)
      })
  }
}
const openDialog = (strs: string) => {
  if (visible.value) return
  contents.value = strs
  visible.value = true
}
const openHistoryDialog = (strs: string) => {
  if (!(contentLists.value.some((item: string) => item == strs))) contentLists.value.push(strs)
}
const openHistoryRecord = () => {
  if (!contentLists.value?.length) return
  show.value = true
}
const toQrCode = () => {
  router.push('/qrcode')
}
const handleUploadImg = () => {
  stop()
  const f: any = document.getElementById("image-code");
  f?.click();
  f.onchange = async function (e: any) {
    const file = e.target.files[0];
    try {
      const data = await html5QrCode?.value.scanFile(file, true)
      openDialog(data)
      openHistoryDialog(data)
    } catch (error) {
      Toast.error('无法识别二维码或者二维码无效')
    } finally {
      start()
    }
  };
}

const initCameraControls = () => {
  if (!videoTrack.value) return
  const caps = videoTrack.value.getCapabilities()
  if ('torch' in caps) {
    supportsTorch.value = true
  }
  if (caps?.zoom) {
    supportsZoom.value = true
    zoomMin.value = caps.zoom.min || 1.0
    zoomMax.value = caps.zoom.max || 4.0
    zoom.value = caps.zoom.current !== undefined ? caps.zoom.current : zoomMin.value
  }
}
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

const applyZoom = async () => {
  console.log("sss", supportsZoom.value)
  if (!videoTrack.value || !supportsZoom.value) return
  try {
    await videoTrack.value.applyConstraints({
      advanced: [{ zoom: zoom.value }]
    })
  } catch (err) {
    console.error('变焦失败:', err)
  }
}
</script>

<style lang="scss" scoped>
$-scanner-color: #ffa500ff;

.Scanner {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 10px;
  padding: 10px;

  .scan {
    flex: 1;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .border {
      background: linear-gradient(to left, $-scanner-color, $-scanner-color) left top no-repeat,
        linear-gradient(to bottom, $-scanner-color, $-scanner-color) left top no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) right top no-repeat,
        linear-gradient(to bottom, $-scanner-color, $-scanner-color) right top no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) left bottom no-repeat,
        linear-gradient(to bottom, $-scanner-color, $-scanner-color) left bottom no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) right bottom no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) right bottom no-repeat;
      background-size: 4px 30px, 30px 4px, 4px 30px, 30px 4px;
      border-radius: 4px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      .reader {
        height: 220px;
        width: 220px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
      }

      .line {
        position: absolute;
        width: 70%;
        height: 4px;
        border-radius: 2px;
        background-color: $-scanner-color;
        z-index: 999999;
        animation: scan 2s ease-in-out both;
        animation-direction: alternate;
        animation-iteration-count: infinite;
        box-shadow: 0px 0px 120px 20px rgba(255, 165, 0, .5);
      }

      @keyframes scan {
        0% {
          top: 20%;
        }

        100% {
          top: 80%;
        }
      }
    }
  }

  .slide {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
    --slider-tooltip-font-size: 14px;
    --slider-tooltip-line-height: 20px;
    --slider-height: 14px;
    --slider-connect-bg: #ffa500ff;
    --slider-tooltip-bg: #ffa500ff;

    .slider-horizontal {
      opacity: 1;
      width: 200px;
    }
  }

  .tool-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;

    .records {
      position: relative;

      .circle {
        position: absolute;
        top: -5px;
        right: -10px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: #e03434;
        color: #fff;
        display: grid;
        font-size: 12px;
        place-content: center;
      }
    }

    .qrcode {
      border-radius: 50%;
    }
  }
}
</style>
