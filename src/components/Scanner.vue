<template>
  <div class="Scanner">
    <div class="logo-box">
      <SvgIcon name="qrcode" color="#fff" size="40px" />
    </div>
    <div class="scan">
      <div class="qrcode"></div>
      <div class="border">
        <div id="reader"></div>
      </div>
    </div>
    <div class="light-box">
      <SvgIcon name="qrcode" color="#fff" size="40px" />
    </div>
    <div class="about-box">
      <SvgIcon name="qrcode-about" color="#fff" size="40px" />
    </div>
    <div class="convert-box">
      <SvgIcon name="OnlineConverter" color="#fff" size="40px" />
    </div>
    <div class="language-box">
      <SvgIcon name="qrcode-language" color="#fff" size="40px" />
    </div>
    <div class="history-box" @click="openHistoryRecord">
      <SvgIcon name="qrcode-history" color="#fff" size="40px" />
    </div>
    <div class="input-box">
      <SvgIcon name="photo-camera" color="#fff" size="40px" />
    </div>
    <HistoryDialog v-model="visible" :list="historyRecords"/>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, onUnmounted } from 'vue'
import { Html5Qrcode } from 'html5-qrcode'
import HistoryDialog from './History.vue'
import SvgIcon from './SvgIcon.vue'
let html5QrCode = reactive<any>(null)
let historyRecords = reactive<any>(["asda", "asda", "asdsa"])
let isShow = ref(false)
let visible = ref(false)
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
      // handle err
      alert('获取设备信息失败')
      console.log('获取设备信息失败', err) // 获取设备信息失败
      // showToast('获取设备信息失败')
    })
}
const start = () => {
  html5QrCode
    ?.start(
    { facingMode: 'environment' },
    {
      fps: 90, // 设置每秒多少帧
      qrbox: { width: 400, height: 400 } // 设置取景范围
      // scannable, rest shaded.
    },
    (decodedText: string, decodedResult: string) => {
      alert(decodedText)
      if (!historyRecords.includes(decodedText))  historyRecords.push(decodedText)
      console.log('result', decodedResult)
    },
    (errorMessage: string) => {
      console.log('暂无额扫描结果', errorMessage)
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
  console.log("sds")
  visible.value = true
}
</script>

<style lang="scss" scoped>
.Scanner {
  // height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: #111;
  display: grid;
  justify-content: center;
  align-items: center;
  position: relative;
  .logo-box {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .input-box {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
  .about-box {
    position: absolute;
    left: 10px;
    bottom: 10px;
  }
  .light-box {
  }
  .convert-box {
    position: absolute;
    right: 10px;
    bottom: 150px;
  }
  .language-box {
    position: absolute;
    left: 10px;
    bottom: 150px;
  }
  .history-box {
    position: absolute;
    right: 50%;
    bottom: 10px;
    transform: translateX(50%);
  }
  .scan {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 40vh;
    max-width: 40vh;
    overflow: hidden;
    border-radius: 4px;
    border: 1px solid rgb(118, 113, 113);
    // border: 4px solid;
    // border-radius: 10px;
    // -webkit-mask: conic-gradient(from -90deg at 40px 40px, red 90deg, transparent 0deg);
    // -webkit-mask-position: -20px -20px;
    .qrcode {
      position: relative;
      width: 400px;
      height: 400px;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        animation: animate 4s ease-in-out infinite;
      }

      &::after {
        content: '';
        position: absolute;
        inset: 20px;
        width: 400px;
        height: 2px;
        background: #35fd5c;
        filter: drop-shadow(0 0 20px #35fd5c) drop-shadow(0 0 60px #35fd5c);
        animation: animate_line 4s ease-in-out infinite;
      }
    }

    .border {
      position: absolute;
      inset: 0;
      // background-size: 400px;
      background-repeat: no-repeat;
      animation: animate_text 2s linear infinite;

      #reader {
        width: 100%;
        height: 100%;
        
        video {
          width: 100%;
          height: 100%;
          
        }
      }
    }

    @keyframes animate {
      0%,
      100% {
        height: 20px;
      }
      50% {
        height: calc(100% - 20px);
      }
    }
    @keyframes animate_line {
      0%,
      100% {
        top: 20px;
      }
      50% {
        top: calc(100% - 20px);
      }
    }

    @keyframes animate_text {
      0%,
      100% {
        opacity: 0;
      }
      50% {
        opacity: 1;
      }
    }
  }
}
</style>
