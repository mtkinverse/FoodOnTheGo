import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceGraphs = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null); // To store chart instance

  // Example data for bar chart
  const barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [1000, 1500, 1200, 1800, 2000],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy(); // Destroy the previous chart instance
    }
    if (chartRef.current) {
      chartInstanceRef.current = new ChartJS(chartRef.current, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [barChartData]); // Re-run the effect if barChartData changes

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-3xl font-extrabold text-center mb-4">Restaurant Performance</h3>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Bar Chart */}
        <div className="flex-1">
          <h4 className="text-2xl font-semibold text-center mb-4">Monthly Revenue</h4>
          <canvas ref={chartRef} /> {/* Chart will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default PerformanceGraphs;
