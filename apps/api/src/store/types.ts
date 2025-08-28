export type ID = string;

export interface User { id: ID; createdAt: string }
export interface Category { id: ID; userId: ID; name: string; icon?: string; archived: boolean; createdAt: string }
export interface Budget { id: ID; userId: ID; categoryId: ID; period: 'month'; limit: number; currency: string; startsOn: string; active: boolean }
export interface Transaction { id: ID; userId: ID; bankAccountId?: ID | null; date: string; amount: number; currency: string; description?: string; merchant?: string; categoryId?: ID | null; createdAt: string }

export interface Store {
  // users
  createGuest(): Promise<User>;
  getUser(id: ID): Promise<User | null>;

  // categories
  listCategories(userId: ID): Promise<Category[]>;
  createCategory(userId: ID, input: Pick<Category, 'name'|'icon'>): Promise<Category>;
  updateCategory(userId: ID, id: ID, patch: Partial<Omit<Category, 'id'|'userId'|'createdAt'>>): Promise<Category | null>;
  deleteCategory(userId: ID, id: ID): Promise<void>;

  // budgets
  listBudgets(userId: ID): Promise<Budget[]>;
  createBudget(userId: ID, input: Omit<Budget, 'id'|'userId'|'active'> & { active?: boolean }): Promise<Budget>;
  updateBudget(userId: ID, id: ID, patch: Partial<Omit<Budget, 'id'|'userId'>>): Promise<Budget | null>;
  deleteBudget(userId: ID, id: ID): Promise<void>;

  // transactions
  listTransactions(userId: ID, filters?: { from?: string; to?: string; categoryId?: ID }): Promise<Transaction[]>;
  createTransaction(userId: ID, input: Omit<Transaction, 'id'|'userId'|'createdAt'>): Promise<Transaction>;
  updateTransaction(userId: ID, id: ID, patch: Partial<Omit<Transaction, 'id'|'userId'|'createdAt'>>): Promise<Transaction | null>;
  deleteTransaction(userId: ID, id: ID): Promise<void>;
}

