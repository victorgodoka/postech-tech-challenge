<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from "@iconify/vue";
interface Props {
  title?: string;
  variant?: 'home' | 'app';
  logo?: string; 
  links?: { label: string; href: string }[];
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  variant: 'home',
  logo: '',
  links: () => []
});

const emit = defineEmits<{
  'action-primary': [];
  'action-secondary': [];
}>();

const topbarVariants = {
  home: "bg-black text-green-500",
  app: "bg-primary text-white",
};

const headerClass = computed(() => {
  return `w-full px-6 py-4 ${topbarVariants[props.variant]}`;
});
const handlePrimaryAction = () => {
  emit('action-primary');
};

const handleSecondaryAction = () => {
  emit('action-secondary');
};
</script>

<template>
  <header :class="headerClass">
    <div class="hidden max-w-7xl mx-auto md:flex items-center justify-between w-full">
      <div class="flex items-center gap-4">
        <div v-if="logo" class="">
          <img 
            :src="logo" 
            width="146" 
            height="32" 
            alt="Logo" 
            class="h-8"
          />
        </div>
        
        <span v-if="title" class="text-lg font-bold">{{ title }}</span>
        
        <nav v-if="links.length > 0" class="flex gap-4 ml-6">
          <a
            v-for="(link, i) in links"
            :key="i"
            :href="link.href"
            class="text-lg hover:underline font-semibold"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
      
      <div class="flex gap-2">
        <slot name="actions">
          <template v-if="variant === 'home'">
            <button 
              @click="handlePrimaryAction"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Abrir Minha Conta
            </button>
            <button 
              @click="handleSecondaryAction"
              class="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition-colors border border-gray-300 hover:border-gray-400"
            >
              Já tenho Conta
            </button>
          </template>
        </slot>
      </div>
    </div>

    <div class="items-center justify-between w-full flex md:hidden">
      <Icon class="text-3xl" icon="material-symbols:menu" />
      <div v-if="logo" class="">
        <img 
          :src="logo" 
          width="146" 
          height="32" 
          alt="Logo" 
          class="h-8"
        />
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>