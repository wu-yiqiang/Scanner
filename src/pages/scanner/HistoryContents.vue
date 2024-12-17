<template>
  <Dialog v-model:visible="visible">
    <div class="card">
      <div v-if="title" class="title">{{ title }}</div>
      <div class="content-box">
        <div v-for="(list, index) in lists" :key="index" class="content-item">
          <div class="contents">{{ list }}</div>
          <div class="copy" @click="handleCopy(list)">复制</div>
        </div>
      </div>
      <div class="bottom-box">
        <div class="cancel" @click="visible = false">关闭</div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang='ts'>
import { computed, defineEmits } from 'vue'
import Dialog from '@/components/Dialog.vue'
import Toast from '@/components/Toast/index.ts'
const emit = defineEmits(['update:open']);
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
  lists: {
    type: Array<string>,
    required: true,
    default: [],
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

  .content-box {
    display: grid;
    row-gap: 4px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    color: var(--text-color-secondary);
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    .content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .contents {
        padding: 10px;
        flex: 1;
        font-size: 14px;
        text-align: justify;
        overflow: hidden;
        word-break: break-all;
        word-wrap: break-word;
      }

      .copy {
        display: flex;
        justify-content: flex-end;
        width: 40px;
        padding: 4px;
        font-size: 14px;
        color: #4a7afe;
        cursor: pointer;
      }
    }

  }


  .bottom-box {
    display: flex;
    justify-content: flex-start;
    column-gap: 10px;

    .cancel {
      padding: 4px;
      font-size: 16px;
      color: #4a7afe;
      cursor: pointer;
    }
  }
}
</style>
