<template>
  <section class="Scanner">
    <div id="reader" width="220px"></div>
  </section>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { Html5QrcodeResult, Html5QrcodeScanner } from 'html5-qrcode'
// import Toast from '@/components/Toast';
// const html5QrcodeScanner = ref(null)
const init = () => {
  let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader",
    {
      fps: 10, qrbox: { width: 250, height: 250 },
      aspectRatio: 1 / 1,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 2
    },
  /* verbose= */ false);
  html5QrcodeScanner.render((decodedText: string, decodedResult: Html5QrcodeResult) => {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    // Toast.success(decodedResult, 0)
  }, () => {

  });
}
onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
//.index{}
</style>
