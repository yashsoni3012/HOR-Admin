import React from 'react';

const Products = () => {
  const products = [
    { id: 1, name: 'Silk Saree', price: '₹15,999', stock: 12, status: 'In Stock' },
    { id: 2, name: 'Designer Lehenga', price: '₹45,999', stock: 5, status: 'Low Stock' },
    { id: 3, name: 'Cotton Kurta', price: '₹2,499', stock: 0, status: 'Out of Stock' },
    { id: 4, name: 'Embroidered Dupatta', price: '₹3,999', stock: 25, status: 'In Stock' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 lg:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-lg font-semibold">Product List</h3>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">Stock</th>
              <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-4 text-sm font-medium text-gray-800">{product.name}</td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{product.price}</td>
                <td className="px-4 lg:px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{product.stock}</td>
                <td className="px-4 lg:px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                    product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;