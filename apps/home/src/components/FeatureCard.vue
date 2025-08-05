<script setup lang="ts">
import { Icon } from "@iconify/vue";

interface Props {
  icon: string;
  title: string;
  description: string;
}

const props = withDefaults(defineProps<Props>(), {
});
</script>

<template>
  <div class="flex flex-col items-center text-center px-6 py-8 rounded">
    <div class="text-green mb-2">
      <Icon :icon="icon" class="text-8xl" />
    </div>
    
    <h3 class="text-xl font-bold text-green mb-2">{{ title }}</h3>
    
    <p class="text-base text-gray-medium max-w-xs">{{ description }}</p>
  </div>
</template>

<style scoped>
</style>
