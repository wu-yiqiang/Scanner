<template>
  <section class="Scanner">
    <div id="reader" width="220px"></div>
  </section>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Html5QrcodeScanner } from 'html5-qrcode'
import Toast from '@/components/Toast';
// const html5QrcodeScanner = ref(null)
const init = () => {
  function onScanSuccess(decodedText: string, decodedResult: string) {
    console.log(`Code matched = ${decodedText}`, decodedResult);
    Toast.success(decodedResult, 0)
  }
  function onScanFailure(error: Error) {
    console.warn(`Code scan error = ${error}`);
  }
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
  html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}
onMounted(() => {
  init()
})
</script>
<style lang="scss" scoped>
//.index{}
</style>
