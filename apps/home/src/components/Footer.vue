<script setup lang="ts">
// Types - equivalente aos tipos do React
interface LinkItem {
  label: string;
  href: string;
}

interface LinkColumn {
  title: string;
  links: LinkItem[];
}

interface Props {
  columns: LinkColumn[];
}

// Props com valores padrão
const props = withDefaults(defineProps<Props>(), {
  columns: () => [
    {
      title: "Produtos",
      links: [
        { label: "Conta corrente", href: "#" },
        { label: "Conta PJ", href: "#" },
        { label: "Cartão de crédito", href: "#" },
      ]
    },
    {
      title: "Conta digital",
      links: [
        { label: "Pix", href: "#" },
        { label: "Pagamentos", href: "#" },
        { label: "Transferências", href: "#" },
      ]
    },
    {
      title: "Institucional",
      links: [
        { label: "Sobre nós", href: "#" },
        { label: "Carreiras", href: "#" },
        { label: "Ajuda", href: "#" },
      ]
    }
  ]
});
</script>

<template>
  <!-- Footer - estrutura exata do dashboard -->
  <footer class="bg-black px-8 py-12 text-base text-white">
    <div class="flex flex-wrap flex-col md:flex-row gap-8 mx-auto max-w-1/2 md:max-w-2/3 xl:max-w-7xl xl:justify-between">
      <!-- Colunas de links -->
      <div v-for="col in columns" :key="col.title">
        <h4 class="font-bold mb-2">{{ col.title }}</h4>
        <ul class="space-y-1">
          <li v-for="(link, i) in col.links" :key="i">
            <a :href="link.href" class="hover:underline">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Seção Desenvolvido por Alura -->
      <div>
        <h4 class="font-bold mb-2">Desenvolvido por Alura</h4>
        <div class="flex flex-col gap-4">
          <!-- Logo -->
          <img 
            width="146" 
            height="32" 
            alt="Logo" 
            src="/logo.png" 
            class="w-[146px] h-[32px]"
          />
          
          <!-- Ícones sociais -->
          <div class="grid grid-cols-3">
            <a href="#" aria-label="Instagram">
              <i class="text-4xl icon-[mdi--instagram]"></i>
            </a>
            <a href="#" aria-label="WhatsApp">
              <i class="text-4xl icon-[mdi--whatsapp]"></i>
            </a>
            <a href="#" aria-label="YouTube">
              <i class="text-4xl icon-[mdi--youtube]"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Estilos específicos do Footer se necessário */
</style>
