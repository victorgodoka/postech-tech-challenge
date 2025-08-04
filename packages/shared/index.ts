/**
 * Barrel export para packages shared
 * Facilita imports entre microfrontends
 */

// Auth
export * from './auth/AuthService';
export * from './auth/ProtectedRoute';

// Events
export * from './events/EventBus';

// Types (se houver)
export type { User, AuthState } from './auth/AuthService';
export type { EventType, EventPayload, MicrofrontendEvents } from './events/EventBus';
