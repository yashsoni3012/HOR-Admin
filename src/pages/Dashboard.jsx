import React from 'react';

const Dashboard = () => {
  const stats = [
    { title: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', color: 'blue' },
    { title: 'Orders', value: '156', change: '+8.2%', color: 'green' },
    { title: 'Customers', value: '1,234', change: '+15.3%', color: 'purple' },
    { title: 'Products', value: '89', change: '+3.1%', color: 'orange' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 text-sm">{stat.title}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</h3>
              <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="font-medium text-gray-800">Order #{1000 + i}</p>
                <p className="text-sm text-gray-500">Customer Name {i}</p>
              </div>
              <span className="text-purple-600 font-semibold">₹{(i * 1250).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;