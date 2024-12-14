<template>
  <section class='LogoTitle'>
    <SvgIcon name="logo" color="#fff" size="40px" />
    <span class="title">{{ title }}</span>
  </section>
  <!-- <div class="logo-title">
    <SvgIcon name="logo" color="#fff" size="40px" />
    <span class="title">QR Code</span>
  </div> -->
</template>

<script setup lang='ts'>
import SvgIcon from '@/components/SvgIcon.vue'
const props = defineProps({
  title: {
    required: false,
    type: String,
    defalt: ""
  }
})
</script>
<style scoped lang='scss'>
.LogoTitle {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 10px;
  .title {
    font-size: 18px;
    color: var(--text-color);
  }
}
</style>
