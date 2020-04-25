import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(transactions: Transaction[]): Promise<Balance> {
    const totalIncome = transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === 'income') {
        return +accumulator + +currentValue.value;
      }
      return accumulator;
    }, 0);

    const totalOutcome = transactions.reduce((accumulator, currentValue) => {
      if (currentValue.type === 'outcome') {
        return +accumulator + +currentValue.value;
      }
      return accumulator;
    }, 0);

    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
