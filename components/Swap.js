import React, { useState } from 'react';
import SolanaPriceGraph from './SolanaPriceGraph';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import { ThirdwebProvider, ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { ethers } from 'ethers';
import { client } from '../utils/constants';

const wallets = [
  createWallet("io.metamask"),
  createWallet("com.coinbase.wallet"),
];

const Swap = () => {
  const [payingCurrency, setPayingCurrency] = useState('SOL');
  const [payingAmount, setPayingAmount] = useState('');
  const [receivingCurrency, setReceivingCurrency] = useState('ETH');
  const exchangeRate = 0.05725527; // 1 SOL = 0.05725527 ETH

  const currencies = ['ETH', 'SOL', 'USDC', 'BTC'];

  const currencyLogos = {
    ETH: '/eth.png',
    SOL: '/solana.png',
    USDC: '/path/to/usdc-logo.png',
    BTC: '/path/to/btc-logo.png',
  };

  const calculateReceivedAmount = () => {
    if (!payingAmount || isNaN(payingAmount)) return '0';
    if (payingCurrency === 'SOL' && receivingCurrency === 'ETH') {
      return (parseFloat(payingAmount) * exchangeRate).toFixed(8);
    } else if (payingCurrency === 'ETH' && receivingCurrency === 'SOL') {
      return (parseFloat(payingAmount) / exchangeRate).toFixed(8);
    }
    return payingAmount; // For other currency pairs, return the same amount (you may want to add more exchange rates)
  };

  const CurrencySelector = ({ value, onChange, currencies }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={currencyLogos[value]}
          alt={`${value} logo`}
          style={{
            width: '24px',
            height: '24px',
            marginRight: '8px'
          }}
        />
        <select
          value={value}
          onChange={onChange}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: '1rem',
            appearance: 'none'
          }}
        >
          {currencies.map(currency => (
            <option key={currency} value={currency}>{currency}</option>
          ))}
        </select>
      </div>
      <span style={{ color: '#a1a1a1' }}>▼</span>
    </div>
  );

  return (
    <div style={{ color: 'white', maxWidth: '100%', margin: 'auto', padding: '20px', backgroundColor: '#2C3038', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
        <div style={{ flex: '1', marginRight: '20px' }}>
          <div style={{ width: '100%', height: '200px', borderRadius: '8px' }}>
            <SolanaPriceGraph />
          </div>
        </div>
        <div style={{ width: '300px' }}>
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#a1a1a1' }}>You're Paying</p>
              <WalletMultiButton />
            </div>
            <div style={{ backgroundColor: 'black', borderRadius: '8px', overflow: 'hidden' }}>
              <CurrencySelector
                value={payingCurrency}
                onChange={(e) => setPayingCurrency(e.target.value)}
                currencies={currencies}
              />
              <input
                type="text"
                value={payingAmount}
                onChange={(e) => setPayingAmount(e.target.value)}
                placeholder="Enter amount"
                style={{
                  backgroundColor: 'transparent',
                  color: '#a1a1a1',
                  border: 'none',
                  fontSize: '1.2rem',
                  width: '100%',
                  padding: '10px',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img src="/updown.png" alt="Up Down Arrow" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ margin: '0', fontSize: '0.9rem', color: '#a1a1a1' }}>To Receive</p>
              <ConnectButton
                client={client}
                wallets={wallets}
                theme="dark"
                connectModal={{ size: "wide" }}
                detailsModal={{
                  payOptions: {
                    buyWithFiat: false,
                    buyWithCrypto: false,
                  },
                }}
              />
            </div>
            <div style={{ backgroundColor: 'black', borderRadius: '8px', overflow: 'hidden' }}>
              <CurrencySelector
                value={receivingCurrency}
                onChange={(e) => setReceivingCurrency(e.target.value)}
                currencies={currencies}
              />
              <p style={{ fontSize: '1.2rem', margin: '0', padding: '10px', color: 'white' }}>{calculateReceivedAmount()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Swap;