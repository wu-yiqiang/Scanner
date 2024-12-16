<template>
  <dialog id="messageBox" ref="messageBoxRef"  aria-modal="true">
    sdada
    <slot />
  </dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
const props = defineProps({
  isShowDialog: {
    type: Boolean
  },
});
const messageBoxRef = ref();
watch(() => props.isShowDialog, (value) => {
  nextTick(() => {
    value && messageBoxRef.value?.showModal();
  })
}, {
  immediate: true
});


const open = () => {
  messageBoxRef.value?.showModal();
}

defineExpose({ open });

</script>
<style lang="scss" scoped>
dialog {
  background-color: red;
}
</style>