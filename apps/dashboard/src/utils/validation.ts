// Note: Install isomorphic-dompurify for production use
// For now, using basic sanitization
const DOMPurify = {
  sanitize: (input: string) => input.replace(/<script[^>]*>.*?<\/script>/gi, '')
};

// Input validation schemas
export const ValidationRules = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Email inválido'
  },
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Senha deve ter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'
  },
  amount: {
    required: true,
    min: 0.01,
    max: 999999.99,
    message: 'Valor deve estar entre R$ 0,01 e R$ 999.999,99'
  },
  description: {
    required: true,
    maxLength: 255,
    message: 'Descrição deve ter no máximo 255 caracteres'
  }
};

// Input sanitization
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return DOMPurify.sanitize(input.trim());
};

// Validation functions
export const validateEmail = (email: string): { isValid: boolean; message?: string } => {
  const sanitized = sanitizeInput(email);
  if (!sanitized) return { isValid: false, message: 'Email é obrigatório' };
  if (!ValidationRules.email.pattern.test(sanitized)) {
    return { isValid: false, message: ValidationRules.email.message };
  }
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (!password) return { isValid: false, message: 'Senha é obrigatória' };
  if (password.length < ValidationRules.password.minLength) {
    return { isValid: false, message: 'Senha deve ter pelo menos 8 caracteres' };
  }
  if (!ValidationRules.password.pattern.test(password)) {
    return { isValid: false, message: ValidationRules.password.message };
  }
  return { isValid: true };
};

export const validateAmount = (amount: number): { isValid: boolean; message?: string } => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return { isValid: false, message: 'Valor inválido' };
  }
  if (amount < ValidationRules.amount.min || amount > ValidationRules.amount.max) {
    return { isValid: false, message: ValidationRules.amount.message };
  }
  return { isValid: true };
};

export const validateDescription = (description: string): { isValid: boolean; message?: string } => {
  const sanitized = sanitizeInput(description);
  if (!sanitized) return { isValid: false, message: 'Descrição é obrigatória' };
  if (sanitized.length > ValidationRules.description.maxLength) {
    return { isValid: false, message: ValidationRules.description.message };
  }
  return { isValid: true };
};

// Rate limiting for API calls
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length < this.maxAttempts) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeUntilReset = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, timeUntilReset);
  }
}
