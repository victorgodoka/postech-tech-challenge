<script setup lang="ts">
import { computed } from 'vue';
import { buttonVariants, type ButtonsVariant } from './buttonVariants';

// Props interface - equivalente ao ButtonProps do React
interface Props {
  variant?: ButtonsVariant;
  type?: 'button' | 'a' | 'link' | 'submit';
  disabled?: boolean;
  href?: string;
}

// Props com valores padrão
const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
  href: '#'
});

// Emits para eventos
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// Computed para classes do botão
const buttonClass = computed(() => {
  const variantClass = props.disabled
    ? buttonVariants.disabled
    : buttonVariants[props.variant];
  
  return `${buttonVariants.base} ${variantClass}`;
});

// Handler para clique
const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event);
  }
};
</script>

<template>
  <!-- Botão tipo link (router-link para Vue) -->
  <router-link
    v-if="type === 'link'"
    :to="href"
    :class="buttonClass"
    @click="handleClick"
  >
    <slot />
  </router-link>

  <!-- Botão tipo âncora -->
  <a
    v-else-if="type === 'a'"
    :href="href"
    :class="buttonClass"
    @click="handleClick"
  >
    <slot />
  </a>

  <!-- Botão padrão -->
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
/* Estilos específicos do componente se necessário */
</style>
