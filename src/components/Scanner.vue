<template>
  <div class="Scanner">
    <div class="logo-box">
      <SvgIcon name="qrcode" color="#fff" size="40px" />
    </div>
    <div class="scan">
      <div class="border">
        <div id="reader" class="reader"></div>
      </div>
    </div>
    <div class="tool-bar">
      <SvgIcon name="qrcode-history" color="#fff" size="40px" @click="openHistoryRecord"/>
      <SvgIcon name="qrcode" color="#fff" size="40px" />
      <SvgIcon name="photo-camera" color="#fff" size="40px" />
    </div>
    <History v-model:DialogVisible="show" :list="historyRecords" />
    <History v-model:DialogVisible="itemShow" :list="Record" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import History from './History.vue'
import SvgIcon from './SvgIcon.vue'
let html5QrCode = reactive<any>(null)
let historyRecords = reactive<any>([])
let Record = reactive<any>([])
let isShow = ref(false)
let show = ref(false)
let itemShow = ref(false)
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
      // alert('获取设备信息失败')
      console.log('获取设备信息失败', err) // 获取设备信息失败
      // showToast('获取设备信息失败')
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
          historyRecords.push(decodedText)
        Record[0] = decodedText
        if (!itemShow.value && !show.value)itemShow.value = true
      }
    )
    .catch((err: string) => {
      console.log(`Unable to start scanning, error: ${err}`)
    })
}

const stop = () => {
  if (devicesInfo?.value) {
    html5QrCode
      .stop()
      .then((ignore: string) => {
        // QR Code scanning is stopped.
        console.log('QR Code scanning stopped.', ignore)
      })
      .catch((err: string) => {
        // Stop failed, handle it.
        console.log('Unable to stop scanning.', err)
      })
  }
}

const openHistoryRecord = () => {
  if (!Boolean(historyRecords.length)) return
  show.value = true
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
    // padding: 0 40px 40px 40px;
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
      .reader {
        min-height: 200px;
        width: 60vw;
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
