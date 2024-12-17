<template>
  <div class="App">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.App {
  flex: 1;
  overflow: hidden;
  display: flex;
}
</style>
