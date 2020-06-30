import { getCustomRepository } from 'typeorm';
// import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Id {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Id): Promise<void> {
    const transactionServiceRepository = getCustomRepository(
      TransactionsRepository,
    );

    await transactionServiceRepository.delete(id);
  }
}

export default DeleteTransactionService;
