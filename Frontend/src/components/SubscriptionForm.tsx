// SubscriptionForm.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OMISE_PUBLIC_KEY } from '../../config';

declare global {
  interface Window {
    Omise: any;
  }
}

// ✅ ประกาศ props interface
interface SubscriptionFormProps {
  planId: string;
  amount: number;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ planId, amount }) => {
  const [omise, setOmise] = useState<any>(null);

  useEffect(() => {
    if (!window.Omise) {
      const script = document.createElement('script');
      script.src = 'https://cdn.omise.co/omise.js';
      script.onload = () => {
        setOmise(window.Omise(OMISE_PUBLIC_KEY));
      };
      document.body.appendChild(script);
    } else {
      setOmise(window.Omise(OMISE_PUBLIC_KEY));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!omise) {
      alert('Omise.js not loaded yet');
      return;
    }

    const card = await omise.createToken('card', {
      name: (document.getElementById('name') as HTMLInputElement).value,
      number: (document.getElementById('number') as HTMLInputElement).value,
      expiration_month: (document.getElementById('exp_month') as HTMLInputElement).value,
      expiration_year: (document.getElementById('exp_year') as HTMLInputElement).value,
      security_code: (document.getElementById('cvc') as HTMLInputElement).value,
    });

    if (card.status === 'failed') {
      alert(card.failure_message);
      return;
    }

    await axios.post('/api/subscriptions/subscribe', {
      planId,
      amountThb: amount,
      cardToken: card.id,
    });

    alert('Subscription successful!');
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <input id="name" placeholder="Cardholder Name" required />
    //   <input id="number" placeholder="Card Number" required />
    //   <input id="exp_month" placeholder="MM" required />
    //   <input id="exp_year" placeholder="YY" required />
    //   <input id="cvc" placeholder="CVC" required />
    //   <button type="submit">Subscribe {amount} THB</button>
    // </form>
    <form
    onSubmit={handleSubmit}
    style={{
        maxWidth: '400px', // กำหนด container width
        margin: '40px auto',
        padding: '30px',
        backgroundColor: 'rgba(245, 245, 245, 0.25)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        fontFamily: 'Arial, sans-serif',
    }}
    >
    <div style={{ textAlign: 'center', marginBottom: '25px', gap: '10px' }}>
        <h2
        style={{
            fontFamily: '"Bebas Neue", cursive',
            fontWeight: 'bold',
            color: '#ffffffff',
            marginBottom: '15px',
        }}
        >
        Subscribe for {amount} THB
        </h2>
        <p style={{ color: '#ffffffff', fontSize: '14px', marginBottom: '20px' }}>
        Enter your card details below to start your subscription.
        </p>
    </div>

    <div style={{ marginBottom: '15px' }}>
        <input
        id="name"
        placeholder="Cardholder Name"
        required
        style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box',
        }}
        />
    </div>

    <div style={{ marginBottom: '15px' }}>
        <input
        id="number"
        placeholder="Card Number"
        required
        style={{
            width: '100%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box',
        }}
        />
    </div>

    <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
        id="exp_month"
        placeholder="MM"
        required
        style={{
            flex: '0 0 30%', // 30% ของความกว้าง container
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box',
        }}
        />
        <input
        id="exp_year"
        placeholder="YY"
        required
        style={{
            flex: '0 0 30%',
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box',
        }}
        />
    </div>
    <div style={{ marginBottom: '20px' }}>
        <input
        id="cvc"
        placeholder="CVC"
        required
        style={{
            padding: '12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box',
        }}
        />
    </div>

    <button
        type="submit"
        style={{
        width: '100%',
        padding: '14px',
        backgroundColor: '#003E87',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#002C64')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#003E87')}
    >
        Subscribe {amount} THB
    </button>
    </form>
  );
};

export default SubscriptionForm;
