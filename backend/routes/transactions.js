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

// GET: Get single transaction by ID
router.get('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update transaction
router.put('/:id', async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(updatedTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
