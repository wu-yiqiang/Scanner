<template>
  <transition name="fade">
    <div class="Toast" :class="type" v-if="isShow">
      <span class="text">{{ props.text }}</span>
      <!-- <div class="icon" @click="handleClose" /> -->
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue"
const isShow = ref<boolean>(false)
const props = defineProps({
  text: {
    type: String,
    default: ""
  },
  // 消息类型： "info" | "success" | "warn" | "error"
  type: {
    type: String,
    default: "success"
  },
  // 消息停留时间：0 表示需要手动关闭
  duration: {
    type: Number,
    default: 4000
  }
})

const handleClose = () => {
  isShow.value = false
}

onMounted(() => {
  isShow.value = true
  if (props.duration) {
    setTimeout(() => {
      handleClose()
    }, props.duration)
  }

})
</script>

<style scoped lang="scss">
.fade-enter-active {
  animation: fade .5s;
}

.fade-leave-active {
  animation: fade .5s reverse;
}

/* 定义帧动画 */
@keyframes fade {
  0% {
    opacity: 0;
    transform: translate(-50%, -50px);
  }

  100% {
    opacity: 1;
  }
}

.Toast {
  min-width: 260px;
  padding: 8px 14px;
  position: fixed;
  z-index: 999999999999999999999;
  left: 50%;
  transform: translateX(-50%);
  top: 20px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  column-gap: 10px;

  .text {
    flex: 1;
    color: #FFFFFF;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
    display: grid;
    place-content: center;
    white-space: nowrap;
      overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }

      .icon {
        display: inline-flex;
          justify-content: center;
          align-items: center;
        cursor: pointer;
        display: inline-block;
        width: 14px;
        height: 2px;
        transform: rotate(45deg);
        background-color: #fff;
        border-radius: 2px;

        // &::after {
        //   content: '';
        //   display: block;
        //   width: 14px;
        //   height: 2px;
        //   border-radius: 2px;
        //   background-color: #fff;
        //   transform: rotate(-90deg);
        //   cursor: pointer;
        // }
      }
      }

      .warn {
        background-color: #FF7A00;
      }

      .error {
        background-color: #CB0000;
      }

      .success {
        background-color: #27682C;
      }

      .info {
        background-color: #165DFF;
}
</style>
