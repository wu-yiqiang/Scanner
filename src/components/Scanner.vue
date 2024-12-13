<template>
  <!-- <div class="Scanner">
    <div class="logo-box">
      <SvgIcon name="qrcode" color="#fff" size="40px" />
    </div>
    <div class="scan">
      <div class="border">
        <div class="line"></div>
        <div id="reader" class="reader" />
      </div>
    </div>
    <div class="tool-bar">
      <SvgIcon name="qrcode-history" color="#fff" size="40px" @click="openHistoryRecord" />
      <SvgIcon name="qrcode" color="#fff" size="40px" />
      <SvgIcon name="photo-camera" color="#fff" size="40px" />
    </div>
    <ScannerContents v-model:open="visible" title="扫码结果" :contsnts="contents" />
  </div> -->
  <demo  />
</template>

<script setup lang="ts">
import demo from './demo.vue'
import ScannerContents from './ScannerContents.vue'
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import Toast from './Toast/index.ts'
import SvgIcon from './SvgIcon.vue'
let html5QrCode = reactive<any>(null)
let historyRecords = reactive<any>([])
let isShow = ref(false)
let visible = ref(false)
let contents = ref("")
let devicesInfo = ref('')
onMounted(() => {
  getCameras()
})

onUnmounted(() => {
  stop()
})

const getCameras = () => {
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        isShow.value = true
        html5QrCode = new Html5Qrcode('reader')
        // start开始扫描
        start()
      }
    })
    .catch((err) => {
      Toast.error('获取设备信息失败')
    })
}
const start = () => {
  html5QrCode
    ?.start(
      { facingMode: 'environment' },
      {
        fps: 40, // 设置每秒多少帧
        // qrbox: { width: 547, height: 547 } // 设置取景范围
        // scannable, rest shaded.
      },
      (decodedText: string, decodedResult: string) => {
        if (!historyRecords.includes(decodedText))
          contents.value = decodedText
          if (!visible.value) visible.value = true
      }
    )
    .catch((err: string) => {
      Toast.error(`Unable to start scanning, error: ${err}`)
    })
}

const stop = () => {
  if (devicesInfo?.value) {
    html5QrCode
      .stop()
      .then((ignore: string) => {
        Toast.error(`QR Code scanning stopped.`)
      })
      .catch((err: string) => {
        Toast.error(`Unable to stop scanning.\n${err}`)
      })
  }
}

</script>

<style lang="scss" scoped>
$-scanner-color: orange;
.Scanner {
  flex: 1;
  overflow: hidden;
  background-color: #111;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  row-gap: 10px;
  padding: 10px;
  .logo-box {
    display: flex;
    justify-content: flex-start;
  }
  .scan {
    flex: 1;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    .border {
      background: linear-gradient(to left, $-scanner-color, $-scanner-color) left top no-repeat,
        linear-gradient(to bottom, $-scanner-color, $-scanner-color) left top no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) right top no-repeat,
        linear-gradient(to bottom, $-scanner-color, $-scanner-color) right top no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) left bottom no-repeat,
        linear-gradient(to bottom, $-scanner-color, $-scanner-color) left bottom no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) right bottom no-repeat,
        linear-gradient(to left, $-scanner-color, $-scanner-color) right bottom no-repeat;
      background-size: 4px 30px, 30px 3px, 4px 30px, 30px 4px;
      border-radius: 4px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-image:
          linear-gradient(0deg,
            transparent 24%,
            rgba(32, 255, 77, 0.1) 25%,
            rgba(32, 255, 77, 0.1) 26%,
            transparent 27%,
            transparent 74%,
            rgba(32, 255, 77, 0.1) 75%,
            rgba(32, 255, 77, 0.1) 76%,
            transparent 77%,
            transparent),
          linear-gradient(90deg,
            transparent 24%,
            rgba(32, 255, 77, 0.1) 25%,
            rgba(32, 255, 77, 0.1) 26%,
            transparent 27%,
            transparent 74%,
            rgba(32, 255, 77, 0.1) 75%,
            rgba(32, 255, 77, 0.1) 76%,
            transparent 77%,
            transparent);
        background-size: 3rem 3rem;
        background-position: -1rem -1rem;
        background: linear-gradient(180deg, rgba(0, 255, 51, 0) 50%, #00ff33 300%);
          border-bottom: 2px solid #00ff33;
      .reader {
        min-height: 200px;
        width: 60vw;
        display: flex;
        justify-content: center;

      }
      .line {
          width: 80%;
          height: 4px;
          border-radius: 2px;
          background-color: $-scanner-color;
          // transform: translateY(-500px);
          // z-index: 99999999999;
        }
    }
  }
  .tool-bar {
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
  }
}
</style>
