<template>
  <div class="qr-scanner">
    <div class="box">
      <div class="line"></div>
      <div class="angle"></div>
    </div>
  </div>
</template>

<script setup lang='ts'>
</script>
<style scoped lang='scss'>
.qr-scanner {
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
  background-size: 30px 30px;
  background-position: -10px -10px;
  width: 100%;
  height: 100%;
  position: relative;
  background-color: #111;

  .box {
    width: 75vw;
    height: 75vw;
    max-height: 75vh;
    max-width: 75vh;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    border: 1px solid rgba(0, 255, 51, 0.2);
  }

  .line {
    height: calc(100% - 2px);
    width: 100%;
    background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
    border-bottom: 3px solid #00ff33;
    transform: translateY(-100%);
    animation: radar-beam 2s infinite;
    animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
    animation-delay: 1.4s;
  }

  .box:after,
  .box:before,
  .angle:after,
  .angle:before {
    content: '';
    display: block;
    position: absolute;
    width: 40px;
    aspect-ratio: 1 / 1;
    border: 4px solid transparent;
  }

  .box:after,
  .box:before {
    top: 0;
    border-top-color: #00ff33;
  }

  .angle:after,
  .angle:before {
    bottom: 0;
    border-bottom-color: #00ff33;
  }

  .box:before,
  .angle:before {
    left: 0;
    border-left-color: #00ff33;
  }

  .box:after,
  .angle:after {
    right: 0;
    border-right-color: #00ff33;
  }

  @keyframes radar-beam {
    0% {
      transform: translateY(-100%);
    }

    100% {
      transform: translateY(0);
    }
  }
}
</style>
