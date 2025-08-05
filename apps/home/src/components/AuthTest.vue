<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { getAllUsers } from '../lib/api';
import Button from './Button/Button.vue';

// Auth composable
const { session, isAuthenticated, login, register, logout, loading, error } = useAuth();

// Test data
const testEmail = ref('test@example.com');
const testPassword = ref('123456');
const testName = ref('Usuário Teste');
const allUsers = ref<any[]>([]);

// Test functions
const testRegister = async () => {
  try {
    await register({
      name: testName.value,
      email: testEmail.value,
      password: testPassword.value
    });
    console.log('Registro bem-sucedido!');
    await loadUsers();
  } catch (err) {
    console.error('Erro no registro:', err);
  }
};

const testLogin = async () => {
  try {
    await login(testEmail.value, testPassword.value);
    console.log('Login bem-sucedido!');
  } catch (err) {
    console.error('Erro no login:', err);
  }
};

const testLogout = () => {
  logout();
  console.log('Logout realizado!');
};

const loadUsers = async () => {
  try {
    allUsers.value = await getAllUsers();
  } catch (err) {
    console.error('Erro ao carregar usuários:', err);
  }
};

// Load users on mount
loadUsers();
</script>

<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto my-8">
    <h2 class="text-2xl font-bold mb-4">Teste de Autenticação</h2>
    
    <!-- Status atual -->
    <div class="mb-6 p-4 bg-gray-100 rounded">
      <h3 class="font-semibold mb-2">Status Atual:</h3>
      <p><strong>Autenticado:</strong> {{ isAuthenticated ? 'Sim' : 'Não' }}</p>
      <p v-if="session"><strong>Email:</strong> {{ session.email }}</p>
      <p v-if="session"><strong>ID:</strong> {{ session.id }}</p>
      <p><strong>Loading:</strong> {{ loading ? 'Sim' : 'Não' }}</p>
      <p v-if="error" class="text-red-600"><strong>Erro:</strong> {{ error }}</p>
    </div>

    <!-- Formulário de teste -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label class="block text-sm font-medium mb-1">Nome:</label>
        <input 
          v-model="testName" 
          type="text" 
          class="w-full px-3 py-2 border rounded-md"
          placeholder="Nome do usuário"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Email:</label>
        <input 
          v-model="testEmail" 
          type="email" 
          class="w-full px-3 py-2 border rounded-md"
          placeholder="email@example.com"
        />
      </div>
      
      <div class="md:col-span-2">
        <label class="block text-sm font-medium mb-1">Senha:</label>
        <input 
          v-model="testPassword" 
          type="password" 
          class="w-full px-3 py-2 border rounded-md"
          placeholder="Senha"
        />
      </div>
    </div>

    <!-- Botões de teste -->
    <div class="flex gap-4 mb-6">
      <Button 
        variant="primary" 
        @click="testRegister"
        :disabled="loading"
      >
        Registrar
      </Button>
      
      <Button 
        variant="secondary" 
        @click="testLogin"
        :disabled="loading"
      >
        Login
      </Button>
      
      <Button 
        variant="black" 
        @click="testLogout"
        :disabled="!isAuthenticated"
      >
        Logout
      </Button>
      
      <Button 
        variant="blackGhost" 
        @click="loadUsers"
      >
        Recarregar Usuários
      </Button>
    </div>

    <!-- Lista de usuários -->
    <div v-if="allUsers.length > 0">
      <h3 class="font-semibold mb-2">Usuários Cadastrados:</h3>
      <div class="space-y-2">
        <div 
          v-for="user in allUsers" 
          :key="user.email"
          class="p-3 bg-gray-50 rounded border"
        >
          <p><strong>Nome:</strong> {{ user.name }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>ID:</strong> {{ user.id }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="text-gray-500">
      Nenhum usuário cadastrado ainda.
    </div>
  </div>
</template>

<style scoped>
</style>
