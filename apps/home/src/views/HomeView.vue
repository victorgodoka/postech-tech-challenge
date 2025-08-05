<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import TopBar from '../components/TopBar.vue';
import Button from '../components/Button/Button.vue';
import FeatureCard from '../components/FeatureCard.vue';
import ModalForm from '../components/ModalForm.vue';
import LoginForm from '../components/LoginForm.vue';
import UserInfo from '../components/UserInfo.vue';
import AuthTest from '../components/AuthTest.vue';

// Props recebidas do App.vue
const props = defineProps<{
  showLoginModal: boolean;
  showRegisterModal: boolean;
}>();

// Emits para comunicar com o App.vue
const emit = defineEmits<{
  'open-login': [];
  'open-register': [];
  'close-modals': [];
}>();

// Estados dos modais - equivalente ao useState do React
const isFormModalOpen = ref(false);
const isLoginModalOpen = ref(false);

// Funções para controlar modais - equivalente às funções do React
const handleFormModalOpen = () => {
  isFormModalOpen.value = true;
};

const handleFormModalClose = () => {
  isFormModalOpen.value = false;
};

const handleLoginModalOpen = () => {
  isLoginModalOpen.value = true;
};

const handleLoginModalClose = () => {
  isLoginModalOpen.value = false;
};

// Links de navegação - equivalente ao dashboard

</script>

<template>
  <div>
    <div class="bg-gradient-to-b from-green-from to-green-to px-4 py-8">
      <div class="flex flex-col xl:flex-row items-center justify-center gap-8">
        <p class="text-center xl:text-left text-black text-2xl font-bold w-full max-w-[446px]">
          Experimente mais liberdade no controle da sua vida financeira.<br>
          Crie sua conta com a gente!
        </p>
        <img
          src="/home-graphs.png"
          width="661"
          height="412"
          class="my-8 w-full max-w-78 md:max-w-[600px] xl:max-w-[661px]"
          alt="Pessoa segurando dinheiro ao lado de gráficos de barras em crescimento, simbolizando finanças ou controle de investimentos."
          sizes="(max-width: 767px) 312px, (max-width: 1279px) 600px, 661px"
        />
      </div>
      
      <div class="flex md:hidden gap-4 items-center justify-center py-4">
        <Button 
          variant="black"
          @click="handleFormModalOpen"
        >
          Abrir Minha Conta
        </Button>
        <Button 
          variant="blackGhost"
          @click="handleLoginModalOpen"
        >
          Já tenho Conta
        </Button>
      </div>

      <div class="flex flex-wrap max-w-3xl mx-auto text-center justify-center">
        <h2 class="w-full font-bold text-2xl">
          Vantagens do nosso banco:
        </h2>
        
        <FeatureCard 
          icon="mynaui:gift"
          title="Conta e cartão gratuitos"
          description="Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção."
        />
        
        <FeatureCard 
          icon="majesticons:money-hand"
          title="Saques sem custo"
          description="Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h."
        />
        
        <FeatureCard 
          icon="meteor-icons:star"
          title="Programa de pontos"
          description="Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!"
        />
        
        <FeatureCard 
          icon="tdesign:device"
          title="Seguro Dispositivos"
          description="Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica."
        />
      </div>
    </div>

    <!-- Modais -->
    <ModalForm 
      :is-open="props.showRegisterModal"
      @close="emit('close-modals')"
    />
    
    <LoginForm 
      :is-open="props.showLoginModal"
      @close="emit('close-modals')"
    />
  </div>
</template>

<style scoped>
/* Estilos específicos do componente */
</style>
