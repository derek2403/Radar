import React, { useState } from 'react';
import SolanaPriceGraph from './SolanaPriceGraph'; // Import the graph component

export default function Popup({ message, onConfirm, onCancel }) {
  const [showGraph, setShowGraph] = useState(false);

  const handleLearnMore = () => {
    setShowGraph(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p className="text-lg font-medium text-center mb-4">{message}</p>
        <div className="flex justify-around mb-4">
          <button
            onClick={onConfirm}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Yes
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            No
          </button>
        </div>
        <div className="text-center">
          <a href="#" onClick={handleLearnMore} className="text-blue-500 underline">
            Learn more
          </a>
        </div>
        {showGraph && <SolanaPriceGraph />}
      </div>
    </div>
  );
}
