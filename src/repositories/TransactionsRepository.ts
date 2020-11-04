import { v4 as uuid } from 'uuid';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { transactions } = this;

    const incomes = transactions.filter(
      transaction => transaction.type === 'income',
    );

    const outcomes = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const reducer = (accumulator: number, currentValue: number): number =>
      accumulator + currentValue;

    const incomesValues = incomes.map(income => income.value);
    const outcomesValues = outcomes.map(outcome => outcome.value);

    const income = incomesValues.reduce(reducer, 0);
    const outcome = outcomesValues.reduce(reducer, 0);

    const balance = { income, outcome, total: income - outcome };

    return balance;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const id = uuid();

    const transaction = { id, title, value, type };

    const balance = this.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new Error('Invalid balance for transaction');
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
