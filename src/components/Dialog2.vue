<template>
  <div to="body" v-if="open" class="Dialog" @click.stop="open = false">
    <div class="content-box">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue'
const emit = defineEmits(['update:visible'])
const props = defineProps({
  visible: {
    require: true,
    type: Boolean,
    default: false
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

</script>

<style lang="scss" scoped>
@mixin noScrollBar {
  scrollbar-width: none;
  &::-webkit-scrollbar {
      width: 0;
      height: 0;
    };
}
.Dialog {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .content-box {
    max-width: 90%;
    max-height: 35%;
    overflow: scroll;
    padding: 3px;
    color: #5a5757;
    background-color: #f1ebeb;
    border-radius: 6px;
    font-size: 16px;
    border: 1px solid rgb(243, 238, 238);
    @include noScrollBar();
  }
}
</style>
