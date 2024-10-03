import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function SolanaPriceGraph() {
  // Input your data points here
  const dataPoints = [
    129, 109, 123, 119, 128, 125, 117, 114, 129, 148,
    155, 179, 189, 162, 143, 151, 149, 137, 115, 110
  ];

  const data = {
    labels: Array(dataPoints.length).fill(''),
    datasets: [
      {
        label: 'Price',
        data: dataPoints,
        borderColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          if (!chartArea) {
            return null;
          }
          return getGradient(ctx, chartArea);
        },
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div style={{ height: '150px', width: '100%' }}>
        <h2 className="text-lg font-medium mb-4">
            SOL/ETH: <span>0.05725527</span> 
        </h2>
        <div style={{ height: '150px', width: '90%', backgroundColor: '#2c2c3d' }}>
            <Line data={data} options={options} />
        </div>
      
    </div>
  );
}

function getGradient(ctx, chartArea) {
  const gradientBg = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0);
  gradientBg.addColorStop(0, 'rgba(0, 255, 255, 1)');   // Bright cyan at the start
  gradientBg.addColorStop(0.5, 'rgba(150, 255, 150, 1)'); // Light green in the middle
  gradientBg.addColorStop(1, 'rgba(255, 255, 0, 1)');   // Yellow at the end
  return gradientBg;
}