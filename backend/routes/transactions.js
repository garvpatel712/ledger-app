import express from 'express';
import Transaction from '../models/transactions.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// POST: Add new transaction
router.post('/add', auth, async (req, res) => {
  const {
    date, party, rate, bag, grossWeight, kapatPerBag,
    kapat, netWeight, netAmount, commission, bardanMarket, tolai, total
  } = req.body;

  try {
    console.log('Creating transaction for user:', req.user._id);
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
      total,
      userId: req.user._id
    });

    await newTransaction.save();
    console.log('Transaction created successfully:', newTransaction);
    res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET: Get all transactions for the current user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching transactions for user:', req.user._id);
    const transactions = await Transaction.find({ userId: req.user._id });
    console.log('Found transactions:', transactions.length);
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(400).json({ error: err.message });
  }
});

// GET: Get single transaction by ID (only if it belongs to the current user)
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('Fetching transaction:', req.params.id, 'for user:', req.user._id);
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!transaction) {
      console.log('Transaction not found or not owned by user');
      return res.status(404).json({ message: 'Transaction not found' });
    }
    console.log('Transaction found:', transaction);
    res.json(transaction);
  } catch (err) {
    console.error('Error fetching transaction:', err);
    res.status(400).json({ error: err.message });
  }
});

// PUT: Update transaction (only if it belongs to the current user)
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating transaction:', req.params.id, 'for user:', req.user._id);
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      console.log('Transaction not found or not owned by user');
      return res.status(404).json({ message: 'Transaction not found' });
    }

    console.log('Transaction found, proceeding with update');
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { ...req.body, userId: req.user._id }, // Ensure userId is preserved
      { new: true }
    );
    console.log('Transaction updated successfully:', updatedTransaction);
    res.json(updatedTransaction);
  } catch (err) {
    console.error('Error updating transaction:', err);
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Delete transaction (only if it belongs to the current user)
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting transaction:', req.params.id, 'for user:', req.user._id);
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!transaction) {
      console.log('Transaction not found or not owned by user');
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(req.params.id);
    console.log('Transaction deleted successfully');
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error('Error deleting transaction:', err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
