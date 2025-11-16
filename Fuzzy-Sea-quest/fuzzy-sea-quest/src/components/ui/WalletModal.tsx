import React from 'react';
import Modal from 'react-modal';

interface WalletModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  balance: number;
  onTransaction: (amount: number) => void;
}

const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onRequestClose, balance, onTransaction }) => {
  const [amount, setAmount] = React.useState<number>(0);

  const handleTransaction = () => {
    if (amount > 0) {
      onTransaction(amount);
      setAmount(0);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
      <h2>Wallet</h2>
      <p>Current Balance: {balance} Tokens</p>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
      />
      <button onClick={handleTransaction}>Transaction</button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default WalletModal;