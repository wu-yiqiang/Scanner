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
      <input id="image-code" accept="image/*" style="display: none" type="file" />
    </div>
    <ScannerContents v-model:open="visible" title="扫码结果" :contsnts="contents" />
    <HistoryContents v-model:open="show" title="扫码结果" :lists="contentLists" />
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon.vue'
import Toast from '@/components/Toast/index.ts'
import LogoTitle from '@/components/LogoTitle.vue'
import ScannerContents from './ScannerContents.vue'
import HistoryContents from './HistoryContents.vue'
import { ref, onMounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import router from '@/router/index'
import { onBeforeRouteLeave } from 'vue-router'
let html5QrCode = ref<any>(null)
let historyRecords = ref<any>([])
let show = ref(false)
let visible = ref(false)
let contents = ref("")
let contentLists = ref(<any>[])
// let startTime = ref(new Date())
onMounted(() => {
  getCameras()
})

onBeforeRouteLeave(() => {
  stop()
})

const getCameras = async () => {
  const devices = await Html5Qrcode.getCameras()
    .catch((err) => {
      console.log("error", err)
      Toast.error(`获取设备信息失败`)
    })
  if (devices && devices.length) {
    html5QrCode.value = new Html5Qrcode('reader')
    start()
  }
}
const start = () => {
  html5QrCode.value
    ?.start(
      { facingMode: 'environment' },
      {
        fps: 60, // 设置每秒多少帧
        // qrbox: { width: 547, height: 547 } // 设置取景范围
        // scannable, rest shaded.
      },
      (decodedText: string, decodedResult: string) => {
        openDialog(decodedText)
        openHistoryDialog(decodedText)
        console.log(decodedResult)
      }
    )
    .catch((err: string) => {
      Toast.error(`Unable to start scanning, error: ${err}`)
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
  if (contents.value == strs) return
  if (contents.value == strs) return
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
    const data = await html5QrCode?.value.scanFile(file, true)
    openDialog(data)
    openHistoryDialog(data)
    start()
  };
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
