<template>
  <dialog v-if="open" class="Dialog" id="dialogBox" ref="dialogBoxRef" aria-modal="true">
    <slot />
  </dialog>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, computed } from 'vue'
const emit = defineEmits(['update:visible']);
const dialogBoxRef = ref();
const props = defineProps({
  visible: {
    type: Boolean
  },
});
const open = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  },
})
watch(() => open?.value, (newVal) => {
  if (newVal) {
    console.log("sds")
    nextTick(() => {
      dialogBoxRef.value?.showModal();
    })
  }
}, {
  immediate: true
} )
</script>
<style lang="scss" scoped>
dialog {
  top: 50%;
  left: 50%;
  padding: 10px;
  transform: translate(-50%, -50%) scale(0);
  animation: scale-up-center-open 0.3s ease-in both;
  border-radius: 4px;
  border: none;
  outline: none;
  background-color: var(--dialog-background-color);
  &::backdrop {
    background-color: rgba(255, 255, 255, 0.5);
  }
}

@keyframes scale-up-center-open {
  0% {
    transform: translate(-50%, -50%) scale(0);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
