<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import Button from './Button/Button.vue';
import { useAuth } from '../composables/useAuth';
import { redirectToDashboard } from '../config';
import { Icon } from "@iconify/vue";

// Props interface - equivalente ao LoginFormProps do React
interface Props {
  isOpen: boolean;
}

// Emits interface
interface Emits {
  close: [];
}

// Props e emits
const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Auth composable
const { login, loading: authLoading, error: authError } = useAuth();

// Estado reativo - equivalente aos useState do React
const visible = ref(true);

// Form state - equivalente ao FormState do React
const form = reactive({
  email: '',
  password: ''
});

// Errors state
const errors = reactive({
  email: '',
  password: ''
});

// Valores padrão do formulário
const formDefaultValue = {
  email: '',
  password: ''
};

// Função para validar email - equivalente ao isValidEmail do React
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Watchers - equivalente aos useEffect do React
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    Object.assign(errors, formDefaultValue);
    visible.value = true;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

// Handlers - equivalentes às funções do React
const handleInputValue = (field: keyof typeof form, value: string) => {
  form[field] = value;
};

const handleClose = () => {
  visible.value = false;
  setTimeout(() => {
    emit('close');
  }, 800);
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  const newErrors = {
    email: isValidEmail(form.email) ? '' : 'Preencha este campo corretamente.',
    password: form.password ? '' : 'Preencha este campo corretamente.'
  };

  Object.assign(errors, newErrors);

  const hasErrors = Object.values(newErrors).some(Boolean);
  if (hasErrors) return;

  try {
    const session = await login(form.email, form.password);
    
    alert('Login realizado com sucesso! Redirecionando para o dashboard...');
    
    // Debug: verificar se sessão foi salva
    console.log('Sessão salva no localStorage:', localStorage.getItem('bank-app-session'));
    console.log('Sessão retornada do login:', session);
    
    // Redirecionar para o dashboard Next.js com token de sessão
    setTimeout(() => {
      console.log('Redirecionando para dashboard...');
      const sessionToken = session ? btoa(JSON.stringify(session)) : undefined;
      redirectToDashboard(sessionToken);
    }, 2000);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    // O erro já é tratado pelo composable, mas podemos mostrar feedback adicional
    if (authError.value) {
      alert(authError.value);
    }
  }
};
</script>

<template>
  <!-- Modal - estrutura exata do dashboard -->
  <div
    v-if="isOpen"
    class="absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center z-50 px-8 md:px-12"
    role="dialog"
    aria-modal="true"
  >
    <form
      @submit="handleSubmit"
      :class="[
        'w-full max-w-3xl bg-offwhite h-full px-12 md:px-24 py-12 flex flex-col items-center shadow-lg relative gap-8',
        visible 
          ? 'animate-fade-up animate-once animate-duration-[750ms]'
          : 'animate-fade animate-once animate-reverse animate-duration-[750ms]'
      ]"
    >
      <button
        type="button"
        class="absolute p-1 rounded-full right-2 top-2 bg-gray-dark cursor-pointer"
        @click="handleClose"
        aria-label="Fechar modal"
      >
        <Icon icon="material-symbols:close" class="text-white" />
      </button>

      <img
        width="355"
        height="261"
        src="/modal-login.png"
        alt="Pessoa ao lado de um notebook com símbolo de cadeado, representando acesso seguro à conta."
        class="w-[355px] h-[261px]"
      />

      <h2 class="text-xl font-bold">Login</h2>

      <div class="w-full">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input
          id="email"
          type="email"
          :value="form.email"
          @input="handleInputValue('email', ($event.target as HTMLInputElement).value)"
          placeholder="Digite seu email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div class="w-full">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input
          id="password"
          type="password"
          :value="form.password"
          @input="handleInputValue('password', ($event.target as HTMLInputElement).value)"
          placeholder="Digite sua senha"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <a href="#" class="underline text-green my-2">
        Esqueci minha senha
      </a>
      <Button 
        variant="secondary" 
        type="submit"
        :disabled="authLoading"
      >
        {{ authLoading ? 'Entrando...' : 'Acessar' }}
      </Button>
    </form>
  </div>
</template>

<style scoped>
</style>
