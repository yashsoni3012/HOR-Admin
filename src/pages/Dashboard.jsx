// import React from 'react';

// const Dashboard = () => {
//   const stats = [
//     { title: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', color: 'blue' },
//     { title: 'Orders', value: '156', change: '+8.2%', color: 'green' },
//     { title: 'Customers', value: '1,234', change: '+15.3%', color: 'purple' },
//     { title: 'Products', value: '89', change: '+3.1%', color: 'orange' },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
//         {stats.map((stat, idx) => (
//           <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
//             <p className="text-gray-600 text-sm">{stat.title}</p>
//             <div className="flex items-end justify-between mt-2">
//               <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{stat.value}</h3>
//               <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
//         <div className="space-y-3">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="flex items-center justify-between py-3 border-b">
//               <div>
//                 <p className="font-medium text-gray-800">Order #{1000 + i}</p>
//                 <p className="text-sm text-gray-500">Customer Name {i}</p>
//               </div>
//               <span className="text-purple-600 font-semibold">₹{(i * 1250).toLocaleString()}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const stats = [
    { title: 'Total Revenue', value: '₹1,24,500', change: '+12.5%', color: 'blue' },
    { title: 'Orders', value: '156', change: '+8.2%', color: 'green' },
    { title: 'Customers', value: '1,234', change: '+15.3%', color: 'purple' },
    { title: 'Products', value: '89', change: '+3.1%', color: 'orange' },
  ];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://hor-server.onrender.com/data');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const userData = await response.json();
        console.log('Fetched user data:', userData); // For debugging
        
        // Check if userData is an array, if not, try to extract users from the response
        let usersArray = userData;
        if (!Array.isArray(userData)) {
          // Try common properties that might contain the user array
          usersArray = userData.users || userData.data || userData.result || [];
        }
        
        setUsers(usersArray);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to get user field with fallback
  const getUserField = (user, fieldNames) => {
    for (let field of fieldNames) {
      if (user[field] !== undefined && user[field] !== null && user[field] !== '') {
        return user[field];
      }
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Users Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Users ({users.length})</h3>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Refresh
          </button>
        </div>
        
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-gray-600 mt-2">Loading users...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-4 bg-red-50 rounded-lg">
            <p className="text-red-600 font-medium">Error loading users: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone Number
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr key={user.id || user._id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getUserField(user, ['firstname', 'firstName', 'first_name', 'fname', 'name'])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserField(user, ['lastname', 'lastName', 'last_name', 'lname', 'surname'])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserField(user, ['email', 'emailAddress', 'email_address'])}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getUserField(user, ['phone', 'phoneNumber', 'phone_number', 'number', 'mobile', 'contact'])}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg">No users found.</p>
            <p className="text-gray-500 text-sm mt-1">The API returned an empty dataset.</p>
          </div>
        )}
      </div>

      {/* Recent Activity Section */}
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