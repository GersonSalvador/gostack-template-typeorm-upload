import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CategoryRepository from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(CategoryRepository);

    const balance = await transactionsRepository.getBalance();

    if (value > balance.total && type === 'outcome')
      throw new AppError('Insuficient founds');

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let categoryCreated;
    if (!checkCategoryExists) {
      categoryCreated = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryCreated);
    }
    // const { id } =
    //   checkCategoryExists ||
    //   (await categoryRepository.save({
    //     title: category,
    //   }));

    const transaction = await transactionsRepository.create({
      title,
      type,
      value,
      category_id:
        (checkCategoryExists && checkCategoryExists.id) || categoryCreated?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
