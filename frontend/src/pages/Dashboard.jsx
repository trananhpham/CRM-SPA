import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = '/api';

const Dashboard = () => {
  const [retentionData, setRetentionData] = useState([]);
  const [peakHoursData, setPeakHoursData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [retentionRes, peakHoursRes, revenueRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/reports/retention`),
          axios.get(`${API_BASE_URL}/reports/peak-hours`),
          axios.get(`${API_BASE_URL}/reports/revenue-reconciliation`)
        ]);

        setRetentionData(retentionRes.data);
        setPeakHoursData(peakHoursRes.data);
        setRevenueData(revenueRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard data...</div>;
  }

  // Retention Chart Data
  const retentionChartData = {
    labels: retentionData.map(d => d.month_start),
    datasets: [
      {
        label: 'Retention Rate (%)',
        data: retentionData.map(d => parseFloat(d.retention_rate_percent)),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Peak Hours Chart Data
  const peakHoursChartData = {
    labels: peakHoursData.map(d => d.hour_label),
    datasets: [
      {
        label: 'Service Frequency',
        data: peakHoursData.map(d => d.total_appointments),
        backgroundColor: '#8b5cf6',
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#f8fafc' }
      }
    },
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
    }
  };

  return (
    <div>
      <h1 className="page-title">MIS Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="glass-panel">
          <h3>Customer Retention Rate</h3>
          <div className="chart-container">
            <Line data={retentionChartData} options={chartOptions} />
          </div>
        </div>

        <div className="glass-panel">
          <h3>Peak Hours (Service Frequency)</h3>
          <div className="chart-container">
            <Bar data={peakHoursChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '1rem' }}>Revenue Reconciliation (Prepaid vs Actual)</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Package</th>
                <th>Paid Amount</th>
                <th>Actual Revenue</th>
                <th>Unearned Revenue</th>
                <th>Sessions (Used/Total)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.customer_name}</td>
                  <td>{row.package_name}</td>
                  <td style={{ color: '#10b981' }}>{Number(row.paid_amount).toLocaleString()}</td>
                  <td style={{ color: '#3b82f6' }}>{Number(row.actual_revenue).toLocaleString()}</td>
                  <td style={{ color: '#f59e0b' }}>{Number(row.unearned_revenue).toLocaleString()}</td>
                  <td>{row.used_sessions} / {row.total_sessions}</td>
                  <td>
                    <span className={`badge ${row.status === 'ACTIVE' ? 'badge-active' : 'badge-new'}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {revenueData.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>No revenue data available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
