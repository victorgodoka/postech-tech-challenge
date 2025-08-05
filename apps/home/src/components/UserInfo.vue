<script setup lang="ts">
import { useAuth } from '../composables/useAuth';
import Button from './Button/Button.vue';

// Auth composable
const { session, logout, isAuthenticated } = useAuth();

// Logout handler
const handleLogout = () => {
  logout();
  alert('Logout realizado com sucesso!');
};
</script>

<template>
  <div v-if="isAuthenticated && session" class="bg-green-100 border border-green-300 rounded-lg p-4 mb-4">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-lg font-semibold text-green-800">
          Bem-vindo!
        </h3>
        <p class="text-green-700">
          Logado como: <strong>{{ session.email }}</strong>
        </p>
        <p class="text-sm text-green-600">
          Sessão expira em: {{ new Date(session.expiresAt).toLocaleString() }}
        </p>
      </div>
      
      <Button 
        variant="secondary" 
        @click="handleLogout"
      >
        Sair
      </Button>
    </div>
  </div>
</template>

<style scoped>
</style>
