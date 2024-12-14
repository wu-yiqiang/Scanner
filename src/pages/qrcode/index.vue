<template>
  <section class='QrCode'>
    <LogoTitle title="QR Code" />
    <div class="main-box">
      <div class="contents">
        <div v-if="code" class="qr-code">
          <img :src="code" alt="加载失败">
        </div>
        <span v-if="code" class="download" @click="handleDownload(code)">下载二维码</span>
      </div>
      <div class="inputs">
        <input v-model="contents" placeholder="请输入内容"/>
        <div class="icon" @click="handleQRGenerator(contents)">
          <SvgIcon name="code" color="#fff" size="38px" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang='ts'>
import QRCode from 'qrcode'
import Toast from '@/components/Toast/index.ts'
import LogoTitle from '@/components/LogoTitle.vue'
import SvgIcon from '@/components/SvgIcon.vue'
import { ref } from 'vue'
import { base64ToBlob } from '@/utils/index'
const props = defineProps({
  title: {
    required: false,
    type: String,
    defalt: ""
  }
})
let contents = ref("")
let code = ref(null)
const handleQRGenerator = async (content: string) => {
  if (!content) return
  code.value = await QRCode.toDataURL(content);
}
const handleDownload = (base64: string) => {
  base64ToBlob(base64, 'code')
}
</script>
<style scoped lang='scss'>
.QrCode {
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: var(--text-color);
  .main-box {
    flex: 1;
    padding: 50px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .contents {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      &:empty::before {
        content: "暂未生成二维码";
        font-size: 18px;
      }

      .qr-code {
        border-radius: 4px;

        img {
          flex: 1;
          aspect-ratio: 1 / 1;
          border-radius: 4px;
        }
      }

      .download {
        font-size: 18px;
        cursor: pointer;
      }
    }

    .inputs {
      width: 80%;
      border-radius: 2px;
      padding-left: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 99999px;
      overflow: hidden;
      padding: 1px;
      padding-left: 10px;
      background-color: var(--input-backgrround-color);
      input {
        outline: 0;
        border: 0;
        flex: 1;
        background-color: unset;
      }

      .icon {
        display: grid;
        place-content: center;
        cursor: pointer;
      }
    }
  }
}
</style>
