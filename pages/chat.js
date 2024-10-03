import React, { useState, useEffect, useRef } from 'react';
import ChatBot from '../components/Chatbox';
import Swap from '@/components/Swap';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, PublicKey, Transaction } from '@solana/web3.js';
import { ThirdwebProvider, ConnectButton, useActiveAccount } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import { ethers } from 'ethers';
import { client } from '../utils/constants';



const Home = () => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const account = useActiveAccount();
const [swapAmount, setSwapAmount] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const canvasRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSwap = async () => {
    if (!connected || !publicKey) {
      alert("Please connect your Solana wallet first!");
      return;
    }

    if (!account || !account.address) {
      alert("Please connect your Ethereum wallet first!");
      return;
    }

    setIsLoading(true);

    try {
      // Solana transfer
      const toPublicKey = new PublicKey('7BkxDHhDfMQ5MUhD6BLCnyMR4JUhvFScWWzupog2pZzP');
      const lamportsToSend = 1_000_000;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: toPublicKey,
          lamports: lamportsToSend,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      alert(`Solana transfer successful! Signature: ${signature}`);

      // Ethereum transfer
      const privateKey = 'bcb9eb3a931c5a761889b27aed39aa18811b87551b3413e68ae68dcb65982887';
      const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/2iPF_MT9jp-O4mQ0eWd1HpeamV3zWWt4');
      const wallet = new ethers.Wallet(privateKey, provider);

      const ethAmount = '0.001'; // Amount of ETH to send
      const tx = await wallet.sendTransaction({
        to: account.address,
        value: ethers.parseEther(ethAmount)
      });

      await tx.wait();

      alert(`Ethereum transfer successful! Transaction hash: ${tx.hash}`);
    } catch (error) {
      console.error('Error:', error);
      alert(`Transfer failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      setResponse(data.response.replace(/\*\*/g, '').replace(/\n/g, '<br />'));

      setTimeout(() => {
        setIsPopupVisible(true);
      }, 5000);

    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleConfirm = () => {
    setIsPopupVisible(false);
    setResponse('The fund will be held until the rate increases.');
  };

  const handleCancel = () => {
    setIsPopupVisible(false);
    setResponse('The fund will be converted immediately.');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let mouseX = 0;
    let mouseY = 0;

    const colors = [
      '#5e2a8c', '#9a42df', '#1d4284', '#2175bf', '#2086cd',
      '#2086cd', '#218dd3', '#158a83', '#19bd94', '#18a285',
      '#1ec7e8', '#c46fd0', '#1c3a76', '#165c5b', '#5974c6',
      '#3d2965', '#cd74dc', '#8d44ed', '#2086cd', '#218dd3',
      '#158a83', '#19bd94', '#18a285', '#1ec7e8'
    ];

    class Bubble {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.baseRadius = radius;
        this.radius = radius;
        this.color = color;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.points = this.generatePoints();
        this.angleOffset = Math.random() * Math.PI * 5;
      }

      generatePoints() {
        const points = [];
        const numPoints = 24 + Math.floor(Math.random() * 1); // Vary the number of points
        for (let i = 0; i < numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const distance = this.radius * (0.5 + Math.random() * 0.7); // Increase randomness
          points.push({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            angle,
            baseDistance: distance,
          });
        }
        return points;
      }

      draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x + this.points[0].x, this.y + this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
          const p1 = this.points[i];
          const p2 = this.points[(i + 1) % this.points.length];
          const mx = (p1.x + p2.x) / 2;
          const my = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(this.x + p1.x, this.y + p1.y, this.x + mx, this.y + my);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update(canvas, time) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        this.radius = this.baseRadius + Math.sin(time + this.angleOffset) * 9; // Pulsating effect

        this.points = this.points.map(p => {
          const noise = (Math.sin(time + p.angle * 10) + 1) / 2; // Noise-like displacement
          const jitter = (Math.random() - 0.5) * 2; // Increased jitter
          const distance = p.baseDistance * (0.8 + noise * 0.4) + jitter;
          return {
            x: Math.cos(p.angle) * distance,
            y: Math.sin(p.angle) * distance,
            angle: p.angle,
            baseDistance: p.baseDistance,
          };
        });
      }
    }

    const createBubbles = (count) => {
      const bubbles = [];
      for (let i = 0; i < count; i++) {
        bubbles.push(new Bubble(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          25 + Math.random() * 35,
          colors[i % colors.length]
        ));
      }
      return bubbles;
    }

    let bubbles = [];
    const cursorBubble = new Bubble(mouseX, mouseY, 10, 'rgba(255, 255, 255, 0.5)');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      bubbles = createBubbles(24);
    };

    const animate = (time) => {
      if (!ctx) return;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.filter = 'blur(25px)';

      bubbles.forEach(bubble => {
        bubble.update(canvas, time * 0.002);
        bubble.draw(ctx);
      });

      cursorBubble.x += (mouseX - cursorBubble.x) * 0.3;
      cursorBubble.y += (mouseY - cursorBubble.y) * 0.3;
      cursorBubble.draw(ctx);

      ctx.filter = 'none';

      bubbles.forEach(bubble => {
        const dx = bubble.x - cursorBubble.x;
        const dy = bubble.y - cursorBubble.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < bubble.radius + cursorBubble.radius) {
          bubble.radius += 0.9;
          cursorBubble.radius = Math.max(5, cursorBubble.radius - 0.2);
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    resizeCanvas();
    animate(0);

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <ChatBot />
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />
      <br />
      <br />
      <div style={{
        margin: '0 auto',
        padding: '32px 16px',
        maxWidth: '60%',
        position: 'relative',
        backgroundColor: '#1E2128',
        color: '#FFFFFF',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '24px',
          textAlign: 'center',
          color: '#c7c7c7'
        }}>AI Crypto Swap Assistant</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g., How can I swap ETH to SOL?"
              style={{
                flexGrow: 1,
                padding: '12px',
                backgroundColor: '#2C3038',
                color: '#FFFFFF',
                border: '1px solid #3D4148',
                borderRadius: '4px 0 0 4px',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: '#512DA8', // Purple color
                color: 'white',
                padding: '12px 24px',
                borderRadius: '0 4px 4px 0',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px', // Fixed width to prevent resizing
                transition: 'background-color 0.3s ease',
              }}
            >
              {isSubmitting && (
                <div className="loading-spinner" style={{ marginRight: '8px' }}></div>
              )}
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
        {response && (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            backgroundColor: '#2C3038',
            color: '#FFFFFF',
            textAlign: 'left'
          }}>
            <p dangerouslySetInnerHTML={{ __html: response }}></p>
            <Swap />
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handleSwap}
                disabled={isLoading || !connected || !account || !account.address}
                style={{
                  backgroundColor: '#3DACF7',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: (isLoading || !connected || !account || !account.address) ? 'not-allowed' : 'pointer',
                  width: '48%',
                  opacity: (isLoading || !connected || !account || !account.address) ? 0.5 : 1,
                }}
              >
                {isLoading ? 'Processing...' : 'Confirm Swap'}
              </button>
              <button
                onClick={() => setResponse('')}
                style={{
                  backgroundColor: '#512DA8',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  width: '48%'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default function App() {
  return (
    <ThirdwebProvider client={client}>
      <Home />
    </ThirdwebProvider>
  );
}
