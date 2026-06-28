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
import { Users, UserPlus, Calendar, DollarSign, TrendingUp, Package } from 'lucide-react';

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
  const [crmSummary, setCrmSummary] = useState(null);
  const [segmentation, setSegmentation] = useState(null);
  const [staffPerformance, setStaffPerformance] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          retentionRes, 
          peakHoursRes, 
          revenueRes,
          summaryRes,
          segmentationRes,
          staffRes
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/reports/retention`),
          axios.get(`${API_BASE_URL}/reports/peak-hours`),
          axios.get(`${API_BASE_URL}/dashboard/revenue-reconciliation`),
          axios.get(`${API_BASE_URL}/dashboard/crm-summary`),
          axios.get(`${API_BASE_URL}/dashboard/customer-segmentation`),
          axios.get(`${API_BASE_URL}/dashboard/staff-performance`)
        ]);

        setRetentionData(retentionRes.data);
        setPeakHoursData(peakHoursRes.data);
        setRevenueData(revenueRes.data);
        setCrmSummary(summaryRes.data);
        setSegmentation(segmentationRes.data);
        setStaffPerformance(staffRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Không thể tải dữ liệu Dashboard. Đang hiển thị dữ liệu dự phòng.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
        <span className="ml-3 text-grayText">Đang tải dữ liệu CRM...</span>
      </div>
    );
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
      legend: { labels: { color: '#475569' } }
    },
    scales: {
      x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } },
      y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(0,0,0,0.05)' } }
    }
  };

  return (
    <div className="pb-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title mb-0">CRM Dashboard</h1>
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </div>
      
      {/* KPI Cards */}
      {crmSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <div className="glass-panel p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-600"><Users size={24}/></div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-medium">Total Customers</p>
              <h4 className="text-2xl font-bold text-gray-800">{crmSummary.totalCustomers}</h4>
            </div>
          </div>
          <div className="glass-panel p-4 flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg text-green-600"><UserPlus size={24}/></div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-medium">New (This Month)</p>
              <h4 className="text-2xl font-bold text-gray-800">{crmSummary.newCustomersThisMonth}</h4>
            </div>
          </div>
          <div className="glass-panel p-4 flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-600"><Calendar size={24}/></div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-medium">Today's Appts</p>
              <h4 className="text-2xl font-bold text-gray-800">{crmSummary.todayAppointments}</h4>
            </div>
          </div>
          <div className="glass-panel p-4 flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-600"><DollarSign size={24}/></div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-medium">Monthly Rev.</p>
              <h4 className="text-xl font-bold text-gray-800">{Number(crmSummary.monthlyRevenue).toLocaleString()}đ</h4>
            </div>
          </div>
          <div className="glass-panel p-4 flex items-center gap-4">
            <div className="p-3 bg-pink-500/20 rounded-lg text-pink-600"><TrendingUp size={24}/></div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-medium">Retention</p>
              <h4 className="text-2xl font-bold text-gray-800">{crmSummary.retentionRate}%</h4>
            </div>
          </div>
          <div className="glass-panel p-4 flex items-center gap-4">
            <div className="p-3 bg-teal-500/20 rounded-lg text-teal-600"><Package size={24}/></div>
            <div>
              <p className="text-gray-500 text-xs uppercase font-medium">Active Packages</p>
              <h4 className="text-2xl font-bold text-gray-800">{crmSummary.activePackages}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="dashboard-grid mb-8">
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

      {/* Segmentation & Staff Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Customer Segmentation */}
        {segmentation && (
          <div className="glass-panel">
            <h3 className="mb-4">Customer Segmentation</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-700">VIP Customers</span>
                <span className="badge badge-active">{segmentation.vipCustomers}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-700">New Customers</span>
                <span className="badge bg-blue-500/10 text-blue-600">{segmentation.newCustomers}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-700">Returning Customers</span>
                <span className="badge bg-purple-500/10 text-purple-600">{segmentation.returningCustomers}</span>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <span className="text-gray-700">Inactive/Lost</span>
                <span className="badge bg-red-500/10 text-red-600">{segmentation.inactiveCustomers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Upcoming Appointments</span>
                <span className="badge bg-yellow-500/10 text-yellow-600">{segmentation.upcomingAppointmentCustomers}</span>
              </div>
            </div>
          </div>
        )}

        {/* Staff Performance */}
        {staffPerformance && (
          <div className="glass-panel overflow-x-auto">
            <h3 className="mb-4">Staff Performance</h3>
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="text-xs uppercase bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Staff</th>
                  <th className="px-4 py-3">Served</th>
                  <th className="px-4 py-3">Revenue</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3 rounded-tr-lg">Conv. %</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, idx) => (
                  <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900">{staff.staffName}</td>
                    <td className="px-4 py-3 text-center">{staff.servedCustomers}</td>
                    <td className="px-4 py-3 text-green-600">{Number(staff.revenueGenerated).toLocaleString()}</td>
                    <td className="px-4 py-3 text-yellow-500">★ {staff.customerRating}</td>
                    <td className="px-4 py-3 text-gray-700">{staff.conversionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Revenue Reconciliation */}
      <div className="glass-panel">
        <h3 className="mb-4">Revenue Reconciliation & Package Usage</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Package</th>
                <th>Sessions (Used/Rem/Total)</th>
                <th>Progress</th>
                <th>Paid Amount</th>
                <th>Unearned Revenue</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.customerName}</td>
                  <td>{row.packageName}</td>
                  <td className="text-center">{row.usedSessions} / {row.remainingSessions} / {row.totalSessions}</td>
                  <td className="w-48">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-gold-500 h-2.5 rounded-full" style={{width: `${row.completionPercentage}%`}}></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 block">{Math.round(row.completionPercentage)}% completed</span>
                  </td>
                  <td style={{ color: '#10b981' }}>{Number(row.paidAmount).toLocaleString()}</td>
                  <td style={{ color: '#f59e0b' }}>{Number(row.unearnedRevenue).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${row.paymentStatus === 'ACTIVE' ? 'badge-active' : 'badge-new'}`}>
                      {row.paymentStatus}
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
