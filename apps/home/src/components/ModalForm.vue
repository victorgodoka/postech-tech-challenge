<script setup lang="ts">
import { ref, reactive, computed, watch, nextTick } from 'vue';
import Button from './Button/Button.vue';
import { useAuth } from '../composables/useAuth';
import { redirectToDashboard } from '../config';

interface Props {
  isOpen: boolean;
}

interface Emits {
  close: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Auth composable
const { register, loading: authLoading, error: authError } = useAuth();

const accepted = ref(false);
const visible = ref(true);

const form = reactive({
  name: '',
  email: '',
  password: ''
});

const errors = reactive({
  name: '',
  email: '',
  password: ''
});

const formDefaultValue = {
  name: '',
  email: '',
  password: ''
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isDisabled = computed(() => {
  return !accepted.value || Object.values(errors).some(error => error !== '') || authLoading.value;
});

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    accepted.value = false;
    Object.assign(errors, formDefaultValue);
    visible.value = true;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});

const handleAccepted = () => {
  accepted.value = !accepted.value;
};

const handleInputValue = (field: keyof typeof form, value: string) => {
  if (!visible.value) return;
  form[field] = value;
};

const validateInputValue = (field: keyof typeof form, value: string) => {
  if (!visible.value) return;
  errors[field] = value ? '' : 'Preencha este campo corretamente.';
};

const validateEmailValue = (value: string) => {
  if (!visible.value) return;
  errors.email = isValidEmail(value) ? '' : 'Preencha este campo corretamente.';
};

const handleSubmit = async (e: Event) => {
  e.preventDefault();

  const newErrors = {
    name: form.name ? '' : 'Preencha este campo corretamente.',
    email: isValidEmail(form.email) ? '' : 'Preencha este campo corretamente.',
    password: form.password ? '' : 'Preencha este campo corretamente.'
  };

  Object.assign(errors, newErrors);

  const hasErrors = Object.values(newErrors).some(Boolean);
  if (hasErrors || !accepted.value) return;

  try {
    await register({
      name: form.name,
      email: form.email,
      password: form.password
    });
    
    alert('Conta criada com sucesso! Redirecionando para o dashboard...');
    handleClose();
    Object.assign(form, formDefaultValue);
    accepted.value = false;
    
    // Debug: verificar se sessão foi salva
    console.log('Sessão salva no localStorage:', localStorage.getItem('bank-app-session'));
    
    // Redirecionar para o dashboard Next.js com delay maior
    setTimeout(() => {
      console.log('Redirecionando para dashboard...');
      redirectToDashboard();
    }, 2000);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    // O erro já é tratado pelo composable, mas podemos mostrar feedback adicional
    if (authError.value) {
      alert(authError.value);
    }
  }
};

const handleClose = () => {
  visible.value = false;
  setTimeout(() => {
    emit('close');
  }, 800);
};
</script>

<template>
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
        <i class="text-white text-2xl icon-[material-symbols--close]"></i>
      </button>

      <img
        width="355"
        height="261"
        src="/modal-register.png"
        alt="Pessoa ao lado de um smartphone exibindo uma interface com botão ativado, simbolizando a criação de conta."
        class="w-[355px] h-[261px]"
      />

      <h2 class="text-xl font-bold">
        Preencha os campos abaixo para criar sua conta corrente!
      </h2>
      <div class="w-full">
        <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
        <input
          id="name"
          type="text"
          :value="form.name"
          @input="handleInputValue('name', ($event.target as HTMLInputElement).value)"
          @blur="validateInputValue('name', ($event.target as HTMLInputElement).value)"
          placeholder="Digite seu nome completo"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
        />
        <p v-if="visible && errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
      </div>

      <div class="w-full">
        <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
        <input
          id="email"
          type="email"
          :value="form.email"
          @input="handleInputValue('email', ($event.target as HTMLInputElement).value)"
          @blur="validateEmailValue(($event.target as HTMLInputElement).value)"
          placeholder="Digite seu email"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
        />
        <p v-if="visible && errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
      </div>

      <div class="w-full">
        <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
        <input
          id="password"
          type="password"
          :value="form.password"
          @input="handleInputValue('password', ($event.target as HTMLInputElement).value)"
          @blur="validateInputValue('password', ($event.target as HTMLInputElement).value)"
          placeholder="Digite sua senha"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
        />
        <p v-if="visible && errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
      </div>

      <label
        for="consent-checkbox"
        class="flex items-center gap-2 cursor-pointer select-none"
      >
        <input
          id="consent-checkbox"
          type="checkbox"
          :checked="accepted"
          @change="handleAccepted"
          class="hidden"
        />

        <div
          :class="[
            'w-5 h-5 transition-all cursor-pointer border-2 border-green rounded-md flex items-center justify-center',
            accepted ? 'bg-green' : 'bg-white'
          ]"
        >
          <i v-if="accepted" class="text-white icon-[material-symbols--close]"></i>
        </div>
        <p class="flex-1 text-sm text-black">
          Li e estou ciente quanto às condições de tratamento dos meus dados
          conforme descrito na
          <span class="underline">Política de Privacidade do banco</span>.
        </p>
      </label>

      <Button 
        variant="red" 
        type="submit" 
        :disabled="isDisabled"
      >
        {{ authLoading ? 'Criando conta...' : 'Criar conta' }}
      </Button>
    </form>
  </div>
</template>

<style scoped>
/* Estilos específicos do modal se necessário */
</style>
