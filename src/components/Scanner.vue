<template>
  <div class="Scanner">
    <div class="logo-box">
      <SvgIcon name="logo" color="#fff" size="40px" />
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
    <HistoryContents v-model:open="show" title="扫码结果" :lists="contentLists" />
  </div>
  <!-- <demo  /> -->
</template>

<script setup lang="ts">
import ScannerContents from './ScannerContents.vue'
import HistoryContents from './HistoryContents.vue'
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import Toast from './Toast/index.ts'
import SvgIcon from './SvgIcon.vue'
let html5QrCode = reactive<any>(null)
let historyRecords = reactive<any>([])
let show = ref(false)
let visible = ref(false)
let contents = ref("")
let contentLists = ref([])
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
          if (contents.value != decodedText) {
            contents.value = decodedText
            if (!visible.value) visible.value = true
          }
          if (!(contentLists.value.some(item => item == decodedText))) contentLists.value.push(decodedText)

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
const openHistoryRecord = () => {
  if (!contentLists.value?.length) return
  show.value = true

}
</script>

<style lang="scss" scoped>
$-scanner-color: rgba(255, 165, 0, 1);

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
      background-size: 4px 30px, 30px 4px, 4px 30px, 30px 4px;
      border-radius: 4px;
      padding: 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      .reader {
        min-height: 200px;
        width: 60vw;
        display: flex;
        justify-content: center;

      }

      .line {
        position: absolute;
        width: 70%;
        height: 4px;
        border-radius: 2px;
        background-color: $-scanner-color;
        z-index: 99999999999;
        animation: scan 1.5s ease-in-out both;
        animation-direction: alternate;
        animation-iteration-count: infinite;
        box-shadow: 0px 0px 120px 20px rgba(255, 165, 0, .5);
      }

      @keyframes scan {
        0% {
          top: 25%;
        }

        100% {
          top: 75%;
        }
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
