/**
 * Sistema de Custom Events para comunicação entre microfrontends
 * Baseado nos conceitos da Aula 3 - Postech
 */

// Tipos de eventos padronizados
export interface MicrofrontendEvents {
  'user:login': { userId: string; email: string; timestamp: number };
  'user:logout': { timestamp: number };
  'transaction:created': { transactionId: string; amount: number; type: string };
  'transaction:updated': { transactionId: string; changes: Record<string, any> };
  'navigation:change': { from: string; to: string; microfrontend: string };
  'theme:change': { theme: 'light' | 'dark' };
  'notification:show': { message: string; type: 'success' | 'error' | 'warning' | 'info' };
}

export type EventType = keyof MicrofrontendEvents;
export type EventPayload<T extends EventType> = MicrofrontendEvents[T];

/**
 * Event Bus para comunicação desacoplada entre microfrontends
 */
export class EventBus {
  private static instance: EventBus;
  private eventTarget: EventTarget;

  private constructor() {
    this.eventTarget = new EventTarget();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Dispara um evento customizado
   * @param eventType Tipo do evento
   * @param payload Dados do evento
   */
  public emit<T extends EventType>(
    eventType: T,
    payload: EventPayload<T>
  ): void {
    const customEvent = new CustomEvent(eventType, {
      detail: {
        ...payload,
        timestamp: Date.now(),
        source: this.getMicrofrontendName(),
      },
    });

    this.eventTarget.dispatchEvent(customEvent);
    
    // Log para debugging (remover em produção)
    console.log(`[EventBus] Emitted: ${eventType}`, payload);
  }

  /**
   * Escuta um evento customizado
   * @param eventType Tipo do evento
   * @param callback Função callback
   */
  public on<T extends EventType>(
    eventType: T,
    callback: (payload: EventPayload<T> & { timestamp: number; source: string }) => void
  ): () => void {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
    };

    this.eventTarget.addEventListener(eventType, listener);

    // Retorna função para remover o listener
    return () => {
      this.eventTarget.removeEventListener(eventType, listener);
    };
  }

  /**
   * Escuta um evento apenas uma vez
   * @param eventType Tipo do evento
   * @param callback Função callback
   */
  public once<T extends EventType>(
    eventType: T,
    callback: (payload: EventPayload<T> & { timestamp: number; source: string }) => void
  ): void {
    const listener = (event: Event) => {
      const customEvent = event as CustomEvent;
      callback(customEvent.detail);
      this.eventTarget.removeEventListener(eventType, listener);
    };

    this.eventTarget.addEventListener(eventType, listener);
  }

  /**
   * Remove todos os listeners de um evento
   * @param eventType Tipo do evento
   */
  public off(eventType: EventType): void {
    // Não há uma forma direta de remover todos os listeners
    // Esta é uma limitação do EventTarget nativo
    console.warn(`[EventBus] Cannot remove all listeners for ${eventType}. Use the returned unsubscribe function instead.`);
  }

  /**
   * Identifica o microfrontend atual
   */
  private getMicrofrontendName(): string {
    // Detecta o microfrontend baseado na URL ou configuração
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const pathname = window.location.pathname;
      
      if (pathname.includes('/dashboard')) return 'dashboard';
      if (pathname.includes('/transactions')) return 'transactions';
      if (pathname.includes('/home')) return 'home';
      if (hostname.includes('shell')) return 'shell';
    }
    
    return 'unknown';
  }
}

// Instância singleton para uso global
export const eventBus = EventBus.getInstance();

// Hooks para React (opcional)
export const useEventBus = () => {
  return {
    emit: eventBus.emit.bind(eventBus),
    on: eventBus.on.bind(eventBus),
    once: eventBus.once.bind(eventBus),
  };
};
