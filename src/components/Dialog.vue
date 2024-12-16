<template>
  <Teleport v-if="open" to="body">
    <div class="Modal">
      <div class="Dialog">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, defineEmits } from 'vue'
const emit = defineEmits(['update:visible']);
const props = defineProps({
  visible: {
    type: Boolean,
    required: true,
    default: false,
  },
  closable: {
    type: Boolean,
    required: true,
    default: true,
  },
});
const open = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  },
});
</script>
<style scoped lang="scss">
.Modal {
  position: fixed;
  z-index: 99999999999 !important;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(44, 44, 44, 0.5);
  .Dialog {
    position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: grid;
      place-content: center;
      animation: scale-up-center-open 0.3s ease-in both;
      border-radius: 4px;
      border: none;
      background-color: var(--dialog-background-color);
    }

    @keyframes scale-up-center-open {
      0% {
        transform: translate(-50%, -50%) scale(0);
      }

      100% {
        transform: translate(-50%, -50%) scale(1);
      }
    }
}
</style>
