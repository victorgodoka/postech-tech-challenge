<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ref, onMounted } from 'vue';
import TopBar from './components/TopBar.vue';    
import Button from './components/Button/Button.vue';
import Footer from './components/Footer.vue';
import { useAuth } from './composables/useAuth';

// Estado global para modais
const showLoginModal = ref(false);
const showRegisterModal = ref(false);

// Auth composable
const { initializeAuth, isAuthenticated, session } = useAuth();

// Initialize auth on app mount
onMounted(() => {
  initializeAuth();
});

// Funções para controlar modais
const openLoginModal = () => {
  showLoginModal.value = true;
  showRegisterModal.value = false;
};

const openRegisterModal = () => {
  showRegisterModal.value = true;
  showLoginModal.value = false;
};

const closeModals = () => {
  showLoginModal.value = false;
  showRegisterModal.value = false;
};

defineExpose({
  openLoginModal,
  openRegisterModal,
  closeModals
});

const navigationLinks = [
  { label: 'Home', href: '#' },
  { label: 'Sobre', href: '/oijio' }
];

const handleFormModalOpen = () => {
  openRegisterModal();
};

const handleLoginModalOpen = () => {
  openLoginModal();
};

// Links de navegação - equivalente ao dashboard
const links = [
  { label: 'Início', href: '/' },
  { label: 'Vantagens', href: '#vantagens' },
  { label: 'Para você', href: '#para-voce' },
  { label: 'Para empresas', href: '#para-empresas' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Blog', href: '#blog' }
];

// Dados das colunas do footer - equivalente ao dashboard
const footerColumns = [
  {
    title: 'Serviços',
    links: [
      { label: 'Conta corrente', href: '#conta' },
      { label: 'Conta PJ', href: '#conta-pj' },
      { label: 'Cartão de crédito', href: '#cartao' },
      { label: 'Empréstimo', href: '#emprestimo' },
      { label: 'Investimentos', href: '#investimentos' }
    ]
  },
  {
    title: 'Contato',
    links: [
      { label: 'Fale conosco', href: '#contato' },
      { label: 'Ouvidoria', href: '#ouvidoria' },
      { label: 'Central de ajuda', href: '#ajuda' },
      { label: 'Trabalhe conosco', href: '#carreiras' }
    ]
  },
  {
    title: 'Sobre',
    links: [
      { label: 'Nossa história', href: '#historia' },
      { label: 'Sustentabilidade', href: '#sustentabilidade' },
      { label: 'Imprensa', href: '#imprensa' },
      { label: 'Política de privacidade', href: '#privacidade' }
    ]
  }
];

</script>

<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <TopBar 
      variant="home"
      logo="/logo-green.png"
      :links="navigationLinks"
      @action-primary="handleFormModalOpen"
      @action-secondary="handleLoginModalOpen"
    >
      <template #actions>
        <Button 
          variant="secondary"
          @click="handleFormModalOpen"
        >
          Abrir Minha Conta
        </Button>
        <Button 
          variant="secondaryGhost"
          @click="handleLoginModalOpen"
        >
          Já tenho Conta
        </Button>
      </template>
    </TopBar>

    <main>
      <RouterView 
        :show-login-modal="showLoginModal"
        :show-register-modal="showRegisterModal"
        @open-login="openLoginModal"
        @open-register="openRegisterModal"
        @close-modals="closeModals"
      />
    </main>
    <Footer :columns="footerColumns" />
  </div>
</template>

<style scoped>
</style>
