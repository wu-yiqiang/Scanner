<template>
  <div class="Scanner">
    <LogoTitle title="Scanner" />
    <div class="scan">
      <div class="border">
        <div class="line"></div>
        <div id="reader" class="reader" />
      </div>
    </div>
    <div class="tool-bar">
      <SvgIcon name="history" color="#fff" size="40px" @click="openHistoryRecord" />
      <SvgIcon name="scan" class="qrcode" color="#fff" size="40px" @click="toQrCode" />
      <SvgIcon name="add" color="#fff" size="40px" @click="handleUploadImg" />
      <input id="file" accept="image/*" style="display: none" type="file" />
    </div>
    <ScannerContents v-model:open="visible" title="扫码结果" :contsnts="contents" />
    <HistoryContents v-model:open="show" title="扫码结果" :lists="contentLists" />
    <Dialog1 :is-show-dialog="true">
      11121
    </Dialog1>
    <Dialog1 :is-show-dialog="true">
      asdas1
    </Dialog1>
  </div>
  <!-- <demo  /> -->
</template>

<script setup lang="ts">
import Dialog1 from '@/components/Dialog1.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import Toast from '@/components/Toast/index.ts'
import LogoTitle from '@/components/LogoTitle.vue'
import ScannerContents from './ScannerContents.vue'
import HistoryContents from './HistoryContents.vue'
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { Html5Qrcode, Html5QrcodeScanner } from 'html5-qrcode'
import router from '@/router/index'
let html5QrCode = reactive<any>(null)
let historyRecords = reactive<any>([])
let show = ref(false)
let visible = ref(false)
let contents = ref("")
let contentLists = ref([])
let lightOpen = ref(false)
let formState = ref()
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
        start()
      }
    })
    .catch((err) => {
      Toast.error(`获取设备信息失败`)
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
const openFlash = () => { }
const toQrCode = () => {
  router.push('/qrcode')
}
const handleUploadImg = () => {
  // const f: any = document.getElementById("file");
  // f?.click();
  // f.onchange = async function (e: any) {
  //   const qrCodeReader = new Html5Qrcode(false); // false 表示不使用摄像头
  //   const file = e.target.files[0];
  //   const data = await qrCodeReader.value.scan(file)
  //   console.log("dd", data)
  // };
}
</script>

<style lang="scss" scoped>
$-scanner-color: rgba(255, 165, 0, 1);

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
        z-index: 999999;
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

    .qrcode {
      border-radius: 50%;
    }
  }
}
</style>
