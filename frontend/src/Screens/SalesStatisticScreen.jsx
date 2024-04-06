import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function SalesStatisticScreen() {
    const [salesData, setSalesData] = useState({ total_sales: 0, total_revenue: 0 });
    const { userInfo } = useSelector(state => state.userLogin);

    useEffect(() => {
        const fetchSalesData = async () => {
            const response = await fetch('/api/sales-statistics/', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userInfo.token.access}`,
                },
            });

            if (!response.ok) {
                console.error('Failed to fetch sales data');
                return;
            }

            const data = await response.json();
            setSalesData(data);
        };

        if (userInfo) {
            fetchSalesData();
        }
    }, [userInfo]);

    return (
        <div>
            <h2>Sales Statistics</h2>
            <p>Total Sales: {salesData.total_sales}</p>
            <p>Total Revenue: ${salesData.total_revenue.toFixed(2)}</p>
        </div>
    );
}

export default SalesStatisticScreen;
