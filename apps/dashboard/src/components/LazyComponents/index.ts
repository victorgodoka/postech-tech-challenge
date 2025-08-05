import { lazy } from 'react';

// Lazy load heavy components to improve initial load time
export const LazyTransactions = lazy(() => import('@/pages/dashboard/Transactions'));
export const LazyHome = lazy(() => import('@/pages/dashboard/Home'));
// Remove problematic Charts import - load individual chart components instead
export const LazyNewTransactionForm = lazy(() => import('@/components/NewTransactionForm'));

// Lazy load chart components individually
export const LazyMonthlySpendingTrend = lazy(() => 
  import('@/components/Charts/MonthlySpendingTrend')
);
export const LazyTransactionTypeDistribution = lazy(() => 
  import('@/components/Charts/TransactionTypeDistribution')
);
export const LazyCashFlowChart = lazy(() => 
  import('@/components/Charts/CashFlowChart')
);
