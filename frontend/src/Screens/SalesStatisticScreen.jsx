import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SalesStatisticScreen() {
  const [salesData, setSalesData] = useState({
    total_sales: 0,
    total_revenue: 0,
    salesByMonth: [],
    revenueByMonth: [],
    users: [],
  });

  const { userInfo } = useSelector(state => state.userLogin);

  const fetchSalesData = () => {
    $.ajax({
      url: 'api/sales-statistics/',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token.access}`,
      },
      success: function (data) {
        setSalesData({
          total_sales: data.total_sales,
          total_revenue: data.total_revenue,
          salesByMonth: Array.isArray(data.salesByMonth) ? data.salesByMonth : [],
          revenueByMonth: Array.isArray(data.revenueByMonth) ? data.revenueByMonth : [],
          users: data.users || [],
        });
      },
      error: function (error) {
        console.error('Failed to fetch sales data', error);
      }
    });
  };

  useEffect(() => {
    if (userInfo) {
      fetchSalesData();
      const intervalId = setInterval(fetchSalesData, 5000); // Polling every 5 seconds
      return () => clearInterval(intervalId);
    }
  }, [userInfo]);

  const chartStyles = {
    padding: '10px',
    background: 'linear-gradient(180deg, rgba(42, 85, 156, 1) 0%, rgba(28, 58, 105, 1) 100%)',
    borderRadius: '10px',
    color: 'white',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.2)',
    margin: '10px'
  };

  const optionsBar = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: 'white'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          borderColor: 'white',
          color: 'rgba(255, 255, 255, 0.3)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const optionsLine = {
    responsive: true,
    scales: {
      x: {
        grid: {
          display: false,
          borderColor: 'white'
        },
        ticks: {
          color: 'white'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          borderColor: 'white',
          color: 'rgba(255, 255, 255, 0.3)'
        },
        ticks: {
          color: 'white'
        }
      }
    },
    elements: {
      point: {
        radius: 5,
        backgroundColor: 'white'
      },
      line: {
        tension: 0.4,
        borderColor: 'white'
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  const salesByMonthData = {
    labels: ['Total Sales'],
    datasets: [{
      label: 'Total Sales',
      data: [salesData.total_sales],
      backgroundColor: '#307bbe',
      borderColor: '#307bbe',
    }]
  };

  const revenueByMonthData = {
    labels: ['Total Revenue'],
    datasets: [{
      label: 'Total Revenue',
      data: [salesData.total_revenue],
      borderColor: '#4bc0c0',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      fill: false,
    }]
  };

  return (
    <div style={{ color: 'white' }}>
      <h2>Sales Statistics</h2>
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ ...chartStyles, width: '300px', textAlign: 'center' }}>
          <p>Total Sales: {salesData.total_sales}</p>
        </div>
        <div style={{ ...chartStyles, width: '300px', textAlign: 'center' }}>
          <p>Total Revenue: ${salesData.total_revenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="chart-container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ ...chartStyles, width: 'calc(50% - 20px)' }}>
          <Bar data={salesByMonthData} options={optionsBar} />
        </div>
        <div style={{ ...chartStyles, width: 'calc(50% - 20px)' }}>
          <Line data={revenueByMonthData} options={optionsLine} />
        </div>
      </div>
      <div style={{ marginTop: '20px', background: '#f4f4f4', padding: '20px', borderRadius: '10px' }}>
        <h3 style={{ color: '#333', marginBottom: '10px' }}>User Information</h3>
        {salesData.users.map(user => (
          <div key={user.id} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
            <h4 style={{ color: '#666', marginBottom: '10px' }}>User: {user.name}</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {user.orders.map(order => (
                <li key={order.id} style={{ marginBottom: '10px' }}>
                  <h5 style={{ color: '#888', marginBottom: '5px' }}>Order: #{order.id}</h5>
                  <p style={{ color: '#555', margin: 0 }}>
                    <strong>Product:</strong> {order.product.name}<br />
                    <strong>Description:</strong> {order.product.description}<br />
                    <strong>Price:</strong> ${order.product.price.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesStatisticScreen;
