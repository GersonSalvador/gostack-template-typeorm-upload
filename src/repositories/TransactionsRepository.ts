import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const [income, outcome] = transactions.reduce(
      (total, item) => {
        total[item.type === 'income' ? 0 : 1] += item.value; // eslint-disable-line no-param-reassign
        return total;
      },
      [0, 0],
    );

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
