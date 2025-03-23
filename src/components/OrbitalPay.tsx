import React, {  useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./orbital.css";

export interface OrbitalPayProps {
  // Basic payment information
  transaction_id: string;
  orbital_public_key: string;
  // UI control
  open: boolean;
  onClose: () => void;


}

enum PaymentState {
  QR_CODE = "qr_code",
  EMAIL_INPUT = "email_input",
  SUCCESS = "success",
  ERROR = "error",
}

// Add this interface before the component
interface CheckoutSession {
  amount: number;
  callback_url: string;
  details: string;
  requester_wallet: string;
  status: string;
  timestamp: number;
  expiration_timestamp: number | null;
  token: string;
  transaction_id: string;
  txhash: string;
  type: string;
  email_linked: boolean;
}

// Add this enum at the top with other interfaces/enums
enum PaymentStatus {
  PENDING = "pending",
  EXPIRED = "cancelled",
  PAID = "paid",
  DECLINED = "declined",
  ERROR = "error"
}

const STATUS_MESSAGES = {
  [PaymentStatus.PENDING]: "Waiting for payment confirmation...",
  [PaymentStatus.EXPIRED]: "This payment request has expired",
  [PaymentStatus.PAID]: "Payment successfully Received ✓",
  [PaymentStatus.DECLINED]: "Payment declined",
  [PaymentStatus.ERROR]: "Unable to process payment. Please try again"
};

function OrbitalPay({
  transaction_id,
  orbital_public_key,
  open,
  onClose,
}: OrbitalPayProps) {
  const [showQR, setShowQR] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [qrString, setQrString] = useState("");
  const [checkoutSession, setCheckoutSession] = useState<CheckoutSession | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [isPolling, setIsPolling] = useState(true);

  const fetchCheckoutSessionFnc = async () => {
    try {
      const response = await fetch(`https://py.api.orbitalpay.xyz/merchants/fetch-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': orbital_public_key || '',
        },
        body: JSON.stringify({
          transaction_id: transaction_id,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch checkout session');
      }
      const data = await response.json();
      if(data.email_linked){
        setIsSuccess(true);
      }
      setCheckoutSession(data);
      return data;
    } catch (error) {
      console.error('Error fetching checkout session:', error);
    }
  };

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      try {
        await fetchCheckoutSessionFnc();
        // Set QR string based on the checkout data
        const baseUrl = `https://app.orbitalpay.xyz/?type=merchant&txid=${transaction_id}`;
        setQrString(baseUrl);
      } catch (error) {
        console.error('Error fetching checkout session:', error);
        setShowQR(false);
      }
    };

    if (transaction_id && open) {
      fetchCheckoutSession();
    }
  }, []);

  
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const pollCheckoutSession = async () => {
      try {
        const data = await fetchCheckoutSessionFnc();
        const currentTimestamp = Date.now();
        console.log('data', data);
        if (data.status === 'expired' || (data.expiration_timestamp && data.expiration_timestamp < currentTimestamp)) {
          setPaymentStatus(PaymentStatus.EXPIRED);
          setIsPolling(false);
        } else if (data.status === 'paid') {
          setPaymentStatus(PaymentStatus.PAID);
          setIsPolling(false);
        } else if (data.status === 'declined') {
          setPaymentStatus(PaymentStatus.DECLINED);
          setIsPolling(false);
        } else {
          setPaymentStatus(PaymentStatus.PENDING);   
        }
        setCheckoutSession(data);
      } catch (error) {
        console.error('Error polling checkout session:', error);
        setPaymentStatus(PaymentStatus.ERROR);
        setIsPolling(false);
      }
    };

    if (isPolling) {
      pollCheckoutSession();
      intervalId = setInterval(pollCheckoutSession, 3000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling]);


  const handleEmailSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.stopPropagation();
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    
    try {
      const requestData = {
        email_or_orb_id: emailInput,
        transaction_id: transaction_id,
      };

      const response = await fetch('https://py.api.orbitalpay.xyz/merchants/request-checkout-from-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': orbital_public_key || ''
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }
      const data = await response.json();
      // console.log( data);
      setIsSuccess(true);
    } catch (error) {
      console.error('Error sending request:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="orbital-modal-container">
      <div className="orbital-modal-header">Pay with Orbital Pay</div>
      <div className="orbital-close-button" onClick={onClose}>
        <span className="orbital-close-button-icon">
          <svg
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.5086 4.50766C4.7055 4.31081 4.97253 4.20023 5.25095 4.20023C5.52937 4.20023 5.79639 4.31081 5.9933 4.50766L10.5009 9.01531L15.0086 4.50766C15.1055 4.40737 15.2213 4.32738 15.3494 4.27235C15.4775 4.21732 15.6153 4.18835 15.7547 4.18714C15.8941 4.18593 16.0324 4.2125 16.1614 4.26529C16.2905 4.31809 16.4077 4.39605 16.5063 4.49464C16.6049 4.59323 16.6829 4.71046 16.7357 4.8395C16.7885 4.96855 16.815 5.10681 16.8138 5.24623C16.8126 5.38565 16.7836 5.52343 16.7286 5.65153C16.6736 5.77963 16.5936 5.8955 16.4933 5.99236L11.9856 10.5L16.4933 15.0077C16.6846 15.2057 16.7904 15.4709 16.788 15.7462C16.7856 16.0215 16.6752 16.2849 16.4805 16.4796C16.2858 16.6742 16.0225 16.7847 15.7472 16.7871C15.4719 16.7895 15.2066 16.6836 15.0086 16.4924L10.5009 11.9847L5.9933 16.4924C5.79526 16.6836 5.53003 16.7895 5.25473 16.7871C4.97942 16.7847 4.71607 16.6742 4.52139 16.4796C4.32671 16.2849 4.21628 16.0215 4.21389 15.7462C4.2115 15.4709 4.31733 15.2057 4.5086 15.0077L9.01625 10.5L4.5086 5.99236C4.31175 5.79545 4.20117 5.52843 4.20117 5.25001C4.20117 4.97158 4.31175 4.70456 4.5086 4.50766Z"
              fill="black"
            ></path>
          </svg>
        </span>
      </div>
      
      <div className="orbital-button-container">
        <button
          className={`orbital-button ${showQR ? "orbital-button-primary" : "orbital-button-secondary"}`}
          onClick={() => setShowQR(true)}
        >
          Scan QR
        </button>
        <button
          className={`orbital-button ${!showQR ? "orbital-button-primary" : "orbital-button-secondary"}`}
          onClick={() => setShowQR(false)}
        >
          Send Request
        </button>
      </div>



      {showQR ? (
        <QRCodeView qrString={qrString} />
      ) : (
        <EmailInputView
          emailInput={emailInput}
          setEmailInput={setEmailInput}
          handleEmailSubmit={handleEmailSubmit}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isError={isError}
          paymentStatus={paymentStatus}
        />
      )}
   
      <div className={`orbital-status-message ${paymentStatus !== PaymentStatus.PENDING ? 'orbital-status-message-' + paymentStatus.toLowerCase() : ''}`}>
        {STATUS_MESSAGES[paymentStatus]}
      </div>


      <div className="orbital-order-details">
        <div className="orbital-order-id">
          <span className="orbital-order-id-label">Transaction ID:</span>
          <span className="orbital-order-id-value">
            {transaction_id.slice(0, 8)}...{transaction_id.slice(-8)}
          </span>
        </div>
      </div>

      <div className="orbital-footer-text">
        Closing this pop-up will terminate the payment process
      </div>
    </div>
  );
}

export default OrbitalPay;



const QRCodeView = ({ qrString }: { qrString: string }) => (
  <div className="orbital-qr-container">
    <div className="orbital-qr-code">
      {qrString ? (
        <QRCode value={qrString} size={200} />
      ) : (
        <div className="orbital-qr-text">Scan QR code to pay</div>
      )}
    </div>
    <div className="orbital-qr-text">Scan QR code to pay</div>
  </div>
);

const EmailInputView = ({
  emailInput,
  setEmailInput,
  handleEmailSubmit,
  isLoading,
  isSuccess,
  isError,
  paymentStatus,
}: {
  emailInput: string;
  setEmailInput: (value: string) => void;
  handleEmailSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  paymentStatus: PaymentStatus;
}) => (
  <>
    <div className="orbital-email-input-container">
      <div className="orbital-email-input-icon">
        <svg
          width="45"
          height="44"
          viewBox="0 0 45 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M44.5 22C44.5 34.1503 34.6503 44 22.5 44C10.3497 44 0.5 34.1503 0.5 22C0.5 9.84974 10.3497 0 22.5 0C34.6503 0 44.5 9.84974 44.5 22ZM36.1552 22C36.1552 29.5415 30.0415 35.6552 22.5 35.6552C14.9585 35.6552 8.84483 29.5415 8.84483 22C8.84483 14.4585 14.9585 8.34483 22.5 8.34483C30.0415 8.34483 36.1552 14.4585 36.1552 22ZM34.6379 12.1379C36.3138 12.1379 37.6724 10.7793 37.6724 9.10345C37.6724 7.42755 36.3138 6.06897 34.6379 6.06897C32.962 6.06897 31.6034 7.42755 31.6034 9.10345C31.6034 10.7793 32.962 12.1379 34.6379 12.1379Z"
            fill="#3F5AE4"
          />
        </svg>
      </div>
      <p className="orbital-email-input-text">
        Add your Registered email ID on Orbital Pay or Orbital Pay ID
      </p>
      <input
        type="text"
        className="orbital-email-input"
        placeholder="username@orbitalpay"
        value={emailInput}
        disabled={isLoading || isSuccess}
        onChange={(e) => {
          e.stopPropagation();
          setEmailInput(e.target.value);
        }}
      />

      {isSuccess && paymentStatus === PaymentStatus.PENDING && (
        <div className="orbital-message orbital-message-success">
          {/* <span className="orbital-message-icon">✓</span> */}
          <span className="orbital-message-text">Request sent to your Orbital Pay account</span>
        </div>
      )}

      {isError && (
        <div className="orbital-message orbital-message-error">
          {/* <span className="orbital-message-icon">✕</span> */}
          <span className="orbital-message-text">ID not registered with Orbital Pay</span>
        </div>
      )}


      {!isSuccess && (
      <button
        className="orbital-button orbital-button-primary"
        onClick={handleEmailSubmit}
        style={{ width: "100%" }}
        disabled={isLoading || isSuccess || isError}
      >
        {isLoading ? "Submitting..." : "Request Payment"}
      </button>)}
    </div>
  </>
);