<template>
  <div class="Scanner">
    <LogoTitle title="Scanner" />
    <div class="scan">
      <div class="border">
        <div class="line"></div>
        <div id="reader" class="reader" />
      </div>
    </div>
    <div class="slide">
      <Slider v-model="zoom" :min="0.2" :step="0.1" :max="10" :format="format" @change="handleZoom" />
    </div>
    <div class="tool-bar">
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
import { ref, onMounted } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'
import router from '@/router/index'
import { onBeforeRouteLeave } from 'vue-router'
let html5QrCode = ref<any>(null)
let show = ref(false)
let visible = ref(false)
let contents = ref("")
let contentLists = ref(<any>[])
let zoom = ref(1)
const format = (value: number) => {
  return `${value.toFixed(1)}x`
}
const config = ref({
  fps: 10, qrbox: { width: 250, height: 250 },
  aspectRatio: 1 / 1,
  showTorchButtonIfSupported: true,
  showZoomSliderIfSupported: true,
  defaultZoomValueIfSupported: 2
})
onMounted(() => {
  init()
})

onBeforeRouteLeave(() => {
  stop()
})
const init = () => {
  function onScanSuccess(decodedText: string, decodedResult: string) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    Toast.success(decodedResult, 0)
  }
  function onScanFailure(error: Error) {
    console.warn(`Code scan error = ${error}`);
  }
  html5QrCode.value = new Html5QrcodeScanner(
    "reader",
    config.value,
  false);
  html5QrCode.value.render(onScanSuccess, onScanFailure);
}
const handleZoom = (value: number) => {
  console.log("value", value)
  config.value.defaultZoomValueIfSupported = value
  stop()
  init()
}
const stop = async () => {
  await html5QrCode.value.clear()
 }
onMounted(() => {
  init()
})
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
      // start()
    }
  };
}
</script>

<style lang="scss" scoped>
$-scanner-color: #ffa500ff;
$-zoom : v-bind(zoom);

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
        // scale: $-zoom;
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
