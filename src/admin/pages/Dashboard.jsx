import React from 'react';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const data = [
  { name: 'T1', doanhThu: 4000, donHang: 24 },
  { name: 'T2', doanhThu: 3000, donHang: 13 },
  { name: 'T3', doanhThu: 2000, donHang: 98 },
  { name: 'T4', doanhThu: 2780, donHang: 39 },
  { name: 'T5', doanhThu: 1890, donHang: 48 },
  { name: 'T6', doanhThu: 2390, donHang: 38 },
  { name: 'T7', doanhThu: 3490, donHang: 43 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }) => (
  <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex items-center">
    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${bgColorClass} ${colorClass} mr-4`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Tổng quan tình hình kinh doanh</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng Doanh Thu" 
          value="124,500,000đ" 
          icon={DollarSign} 
          colorClass="text-green-600"
          bgColorClass="bg-green-50"
        />
        <StatCard 
          title="Đơn Hàng Mới" 
          value="45" 
          icon={ShoppingBag} 
          colorClass="text-blue-600"
          bgColorClass="bg-blue-50"
        />
        <StatCard 
          title="Tổng Khách Hàng" 
          value="1,240" 
          icon={Users} 
          colorClass="text-purple-600"
          bgColorClass="bg-purple-50"
        />
        <StatCard 
          title="Sản Phẩm" 
          value="342" 
          icon={Package} 
          colorClass="text-orange-600"
          bgColorClass="bg-orange-50"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Biểu đồ doanh thu</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  formatter={(value) => [`${value}$`, 'Doanh thu']}
                />
                <Line type="monotone" dataKey="doanhThu" stroke="#000000" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng theo tháng</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar dataKey="donHang" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
