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
    });

    const { userInfo } = useSelector(state => state.userLogin);

    const fetchSalesData = () => {
        $.ajax({
            url: '/api/sales-statistics/',
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
        labels: salesData.salesByMonth.map(item => item.month),
        datasets: [{
            label: 'Total Sales',
            data: salesData.salesByMonth.map(() => salesData.total_sales),
            backgroundColor: '#307bbe',
            borderColor: '#307bbe',
        }]
    };

    const revenueByMonthData = {
        labels: salesData.revenueByMonth.map(item => item.month),
        datasets: [{
            label: 'Total Revenue',
            data: salesData.revenueByMonth.map(() => salesData.total_revenue),
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
        </div>
    );
}

export default SalesStatisticScreen;
