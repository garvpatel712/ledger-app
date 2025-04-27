import express from 'express';
import Transaction from '../models/transactions.js';

const router = express.Router();

// POST: Add new transaction
router.post('/add', async (req, res) => {
  const {
    date, party, rate, bag, grossWeight, kapatPerBag,
    kapat, netWeight, netAmount, commission, bardanMarket, tolai, total
  } = req.body;

  try {
    const newTransaction = new Transaction({
      date,
      party,
      rate,
      bag,
      grossWeight,
      kapatPerBag,
      kapat,
      netWeight,
      netAmount,
      commission,
      bardanMarket,
      tolai,
      total
    });

    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
