// components/ProductCard.jsx
const ProductCard = ({ product }) => {
  const imageUrl = `https://api.houseofresha.com${product.images}`;
  
  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2">
      <div className="relative h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.sizes.join(', ')}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{product.categoryId.name}</span>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div>
            <span className="font-medium text-gray-700 text-xs block mb-1">Details:</span>
            <div className="flex flex-wrap gap-1">
              {product.details.slice(0, 2).map((detail, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {detail}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]">
          View Details
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
