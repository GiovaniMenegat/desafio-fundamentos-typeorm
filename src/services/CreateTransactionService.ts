// import AppError from '../errors/AppError';
import { getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Invalid type.');
    }

    let category = await categoryRepository.findOne({
      where: { title: category_title },
    });

    if (!category) {
      categoryRepository.create({ title: category_title });
      category = await categoryRepository.save({ title: category_title });
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });
    await transactionsRepository.save(transaction);

    return { ...transaction, category };
  }
}

export default CreateTransactionService;
