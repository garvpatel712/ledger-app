import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  party: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  bag: {
    type: Number,
    required: true
  },
  grossWeight: {
    type: Number,
    required: true
  },
  kapatPerBag: {
    type: Number,
    required: true
  },
  kapat: {
    type: Number,
    required: true
  },
  netWeight: {
    type: Number,
    required: true
  },
  netAmount: {
    type: Number,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  bardanMarket: {
    type: Number,
    required: true
  },
  tolai: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
