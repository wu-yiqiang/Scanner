<template>
  <Dialog :visible="visible">
    <div class="card">
      <div v-if="title" class="title">{{ title }}</div>
      <div class="contents">{{ contsnts }}</div>
      <div class="bottom-box">
        <div class="cancel" @click="visible = false">关闭</div>
        <div class="submit" @click="handleCopy(props?.contsnts)">复制</div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang='ts'>
import { computed, defineEmits, ref } from 'vue'
import Dialog from '@/components/Dialog.vue'
import Toast from '@/components/Toast/index.ts'
const emit = defineEmits(['update:open']);
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
  contsnts: {
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

function handleCopy(str: string) {
  var aux = document.createElement('input')
  aux.setAttribute('value', str)
  document.body.appendChild(aux)
  aux.select()
  document.execCommand('copy')
  document.body.removeChild(aux)
  Toast.success('复制成功')
  visible.value = false
}

</script>
<style scoped lang='scss'>
.card {
  display: flex;
  flex-direction: column;
  align-content: space-between;
  padding: 10px;
  border-radius: 4px;
  min-width: 70vw;
  max-width: 80vw;

  .title {
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  .contents {
    padding: 10px;
    flex: 1;
    font-size: 14px;
    text-align: justify;
    overflow: hidden;
    word-break: break-all;
    word-wrap: break-word;
  }

  .bottom-box {
    display: flex;
    justify-content: flex-end;
    column-gap: 10px;

    .cancel,
    .submit {
      padding: 4px;
      font-size: 16px;
      color: #4a7afe;
      cursor: pointer;
    }
  }
}
</style>
