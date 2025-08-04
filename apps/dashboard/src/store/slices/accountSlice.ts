import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDB } from '@/lib/db';

export type Account = {
  id: string;
  name: string;
  balance: number;
  balanceVisible: boolean;
  type: string;
  updatedAt: string;
};

interface AccountState {
  accounts: { [id: string]: Account };
  loading: boolean;
  error: string | null;
}

const initialState: AccountState = {
  accounts: {},
  loading: false,
  error: null,
};

// Async thunks
export const fetchAccount = createAsyncThunk(
  'accounts/fetchAccount',
  async (accountId: string) => {
    const db = await getDB();
    const account = await db.get('accounts', accountId);
    return account;
  }
);

export const fetchAllAccounts = createAsyncThunk(
  'accounts/fetchAllAccounts',
  async () => {
    const db = await getDB();
    const accounts = await db.getAll('accounts');
    return accounts;
  }
);

export const updateAccount = createAsyncThunk(
  'accounts/updateAccount',
  async ({ id, data }: { id: string; data: Partial<Account> }) => {
    const db = await getDB();
    const currentAccount = await db.get('accounts', id);
    const updatedAccount = { ...currentAccount, ...data, id, updatedAt: new Date().toISOString() };
    await db.put('accounts', updatedAccount);
    return updatedAccount as Account;
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateAccountBalance: (state, action: PayloadAction<{ id: string; balance: number }>) => {
      const { id, balance } = action.payload;
      if (state.accounts[id]) {
        state.accounts[id].balance = balance;
        state.accounts[id].updatedAt = new Date().toISOString();
      }
    },
    toggleBalanceVisibility: (state, action: PayloadAction<string>) => {
      const accountId = action.payload;
      if (state.accounts[accountId]) {
        state.accounts[accountId].balanceVisible = !state.accounts[accountId].balanceVisible;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch single account
      .addCase(fetchAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.accounts[action.payload.id] = action.payload;
        }
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch account';
      })
      // Fetch all accounts
      .addCase(fetchAllAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        state.loading = false;
        const accountsMap: { [id: string]: Account } = {};
        action.payload.forEach((account: Account) => {
          accountsMap[account.id] = account;
        });
        state.accounts = accountsMap;
      })
      .addCase(fetchAllAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch accounts';
      })
      // Update account
      .addCase(updateAccount.fulfilled, (state, action) => {
        if (action.payload) {
          state.accounts[action.payload.id] = action.payload;
        }
      })
      .addCase(updateAccount.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to update account';
      });
  },
});

export const { clearError, updateAccountBalance, toggleBalanceVisibility } = accountSlice.actions;
export default accountSlice.reducer;
