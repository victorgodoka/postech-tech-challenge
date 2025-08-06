// reset-db.js - Script para limpar IndexedDB
// Execute no DevTools Console do navegador

console.log('🔄 Iniciando limpeza do IndexedDB...');

// Função para deletar banco de dados
function deleteDatabase(dbName) {
  return new Promise((resolve, reject) => {
    const deleteReq = indexedDB.deleteDatabase(dbName);
    
    deleteReq.onerror = () => {
      console.error(`❌ Erro ao deletar banco ${dbName}:`, deleteReq.error);
      reject(deleteReq.error);
    };
    
    deleteReq.onsuccess = () => {
      console.log(`✅ Banco ${dbName} deletado com sucesso`);
      resolve();
    };
    
    deleteReq.onblocked = () => {
      console.warn(`⚠️ Banco ${dbName} bloqueado - feche outras abas`);
    };
  });
}

// Limpar localStorage
localStorage.clear();
console.log('✅ localStorage limpo');

// Limpar sessionStorage
sessionStorage.clear();
console.log('✅ sessionStorage limpo');

// Deletar banco IndexedDB
deleteDatabase('bank-app')
  .then(() => {
    console.log('🎉 Limpeza completa! Recarregue a página.');
    // Opcional: recarregar página automaticamente
    // window.location.reload();
  })
  .catch(error => {
    console.error('❌ Erro na limpeza:', error);
  });

// Instruções
console.log(`
📋 INSTRUÇÕES:
1. Execute este script no Console do DevTools
2. Recarregue a página após a limpeza
3. O banco será recriado automaticamente na versão 4
4. Teste o fluxo de login novamente
`);
