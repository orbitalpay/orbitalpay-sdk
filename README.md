# Orbital Pay SDK Integration Example

This repository demonstrates how to integrate the Orbital Pay SDK into a Next.js application. The SDK provides a simple way to implement payment functionality with just a few lines of code.

## Installation

```bash
npm install orbital-pay-sdk
# or
yarn add orbital-pay-sdk
```

## Usage


```tsx
"use client"
import * as React from 'react';
import OrbitalPay from 'orbital-pay-sdk';

export default function PaymentPage() {
  const [open, setOpen] = React.useState(false);
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  return (
    <div>
      <button onClick={handleOpen}>
        Open Payment Modal
      </button>
      
      {open && (
        <OrbitalPay
          transaction_id="your_transaction_id"
          orbital_public_key={process.env.NEXT_PUBLIC_ORBITAL_PUBLIC_KEY}
          open={open}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
```

## Required Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `transaction_id` | string | Yes | Unique identifier for the transaction |
| `orbital_public_key` | string | Yes | Your Orbital Pay public API key |
| `open` | boolean | Yes | Controls the visibility of the payment modal |
| `onClose` | function | Yes | Callback function when the modal is closed |

## Environment Variables

Create a `.env.local` file in your project root and add your Orbital Pay API keys:

```env
NEXT_PUBLIC_ORBITAL_PUBLIC_KEY=your_public_key_here
```

## API Integration and Generating transaction_id

The SDK can be integrated with the Orbital Pay API to create checkout sessions. Here's an example of creating a checkout:

```typescript
const response = await fetch('https://py.api.orbitalpay.xyz/merchants/create-checkout', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.NEXT_PUBLIC_ORBITAL_PRIVATE_KEY
  },
  body: JSON.stringify({
    amount: 150000, // Must be Converted into full perecision
    details: 'Sample money request',
    token: 'USDC'
  })
  const data = await response.json();

//   interface CheckoutSession {
//   amount: number;
//   callback_url: string;
//   details: string;
//   requester_wallet: string;
//   status: string;
//   timestamp: number;
//   expiration_timestamp: number | null;
//   token: string;
//   transaction_id: string;
//   txhash: string;
//   type: string;
//   email_linked: boolean;
// }

});
```

## Features

- Clean and modern UI
- Responsive design
- Simple integration
- Modal-based payment flow
- Environment variable configuration
- TypeScript support
- USDC payment support
- Customizable transaction details

## Browser Support

The SDK supports all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)



## Security Notes

- Always store API keys in environment variables
- Never expose private keys in client-side code
- Use HTTPS in production environments
- Keep your `orbital_public_key` secure
- Implement proper error handling for API responses


