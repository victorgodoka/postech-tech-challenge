// Tipos para Module Federation
declare module 'home/App' {
  import React from 'react';
  const HomeApp: React.ComponentType;
  export default HomeApp;
}

declare module 'home/router' {
  export * from 'vue-router';
}
