<template>
  <Dialog v-model:visible="open" @update="open = false">
    <div v-for="(item, index) in props.list" :key="index">
      <div class="item">
        <span class="contents">{{ item }}</span>
        <div class="icon" @click.stop="handleCopy(item)">
          <SvgIcon name="copy" color="#000" size="30px" />
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Dialog from './Dialog2.vue'
import SvgIcon from './SvgIcon.vue'
import Toast from './Toast/index.ts'
const emit = defineEmits(['update:visible'])
const props = defineProps({
  list: {
    require: true,
    type: Object,
    default: () => [],
  },
  visible: {
    require: true,
    type: Boolean,
    default: false,
  },
})
const open = computed({
  get() {
    return props?.visible
  },
  set(value) {
    emit('update:visible', value)
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

<style lang="scss" scoped>
.Dialog {
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .contents {
      text-align: justify;
    }
    .icon {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
