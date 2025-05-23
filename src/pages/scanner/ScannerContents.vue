<template>
  <Dialog v-model:visible="visible">
    <div class="card">
      <div v-if="title" class="title">{{ title }}</div>
      <div class="contents">{{ contents }}</div>
      <div class="bottom-box">
        <div class="cancel" @click="visible = false">关闭</div>
        <div class="submit" @click="handleCopy(props?.contents)">复制</div>
        <div v-if="isLink" class="visit" @click="handleVisit(props?.contents)">直接访问</div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang='ts'>
import { isInternet } from '@/utils/validate';
import { computed } from 'vue'
import Dialog from '@/components/Dialog.vue'
import Toast from '@/components/Toast/index.ts'
const emit = defineEmits(['update:open']);
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
  contents: {
    type: String,
    required: true,
    default: "",
  },
  title: {
    type: String,
    required: false,
    default: "",
  },
});
const visible = computed({
  get() {
    return props?.open
  },
  set(value) {
    emit('update:open', value)
  },
})
const isLink = computed(() => {
  return isInternet(props?.contents)
})
const handleCopy = async (text: string) => {
  await navigator?.clipboard?.writeText(text);
  Toast.success('复制成功')
  visible.value = false
}

const handleVisit = (link: string) => {
  window.open(link)
}

</script>
<style scoped lang='scss'>
.card {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  border-radius: 4px;
  min-width: 70vw;
  max-width: 80vw;
  min-height: 60px;
  max-height: 50vh;
  .title {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: var(--text-color);
  }
  .contents {
    padding: 10px;
    flex: 1;
    font-size: 14px;
    text-align: justify;
    overflow: auto;
    word-break: break-all;
    word-wrap: break-word;
    color: var(--text-color);
  }

  .bottom-box {
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;
    .cancel,.visit,
    .submit {
      padding: 4px;
      font-size: 16px;
      color: #0044ff;
      cursor: pointer;
    }
  }
}
</style>
