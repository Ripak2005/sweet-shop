import { useState, useEffect } from 'react';
import { useSweet } from '../context/SweetContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { sweets, loading, fetchSweets, searchSweets, purchaseSweet } = useSweet();
  const [searchParams, setSearchParams] = useState({
    name: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });
  const [purchaseQuantities, setPurchaseQuantities] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = () => {
    // Filter out empty params
    const params = Object.entries(searchParams).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {});

    if (Object.keys(params).length > 0) {
      searchSweets(params);
    } else {
      fetchSweets();
    }
  };

  const handleClearSearch = () => {
    setSearchParams({
      name: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    fetchSweets();
  };

  const handleQuantityChange = (sweetId, value) => {
    setPurchaseQuantities({
      ...purchaseQuantities,
      [sweetId]: parseInt(value) || 1
    });
  };

  const handlePurchase = async (sweet) => {
    const quantity = purchaseQuantities[sweet._id] || 1;
    
    const result = await purchaseSweet(sweet._id, quantity);
    
    if (result.success) {
      setMessage({
        type: 'success',
        text: `Successfully purchased ${quantity} ${sweet.name}(s) for $${result.totalPrice.toFixed(2)}!`
      });
      setPurchaseQuantities({
        ...purchaseQuantities,
        [sweet._id]: 1
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } else {
      setMessage({
        type: 'error',
        text: result.error
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">Welcome to Sweet Shop 🍬</h1>
            <p className="dashboard-subtitle">
              Discover our delicious selection of sweets
            </p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="search-section">
            <div className="search-card">
              <h3 className="mb-4">Search & Filter</h3>
              <div className="search-bar">
                <div className="search-input">
                  <input
                    type="text"
                    name="name"
                    value={searchParams.name}
                    onChange={handleSearchChange}
                    placeholder="Search by name..."
                  />
                </div>

                <div className="search-select">
                  <select
                    name="category"
                    value={searchParams.category}
                    onChange={handleSearchChange}
                  >
                    <option value="">All Categories</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="candy">Candy</option>
                    <option value="gummy">Gummy</option>
                    <option value="lollipop">Lollipop</option>
                    <option value="hard-candy">Hard Candy</option>
                    <option value="toffee">Toffee</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="search-price">
                  <input
                    type="number"
                    name="minPrice"
                    value={searchParams.minPrice}
                    onChange={handleSearchChange}
                    placeholder="Min $"
                    min="0"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={searchParams.maxPrice}
                    onChange={handleSearchChange}
                    placeholder="Max $"
                    min="0"
                  />
                </div>

                <button onClick={handleSearch} className="btn btn-primary">
                  Search
                </button>
                <button onClick={handleClearSearch} className="btn btn-secondary">
                  Clear
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : sweets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍭</div>
              <h2 className="empty-state-title">No sweets found</h2>
              <p className="empty-state-text">
                Try adjusting your search filters or check back later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3">
              {sweets.map((sweet) => (
                <div key={sweet._id} className="sweet-card">
                  <img
                    src={sweet.imageUrl}
                    alt={sweet.name}
                    className="sweet-image"
                  />
                  <div className="sweet-content">
                    <h3 className="sweet-name">{sweet.name}</h3>
                    <span className="sweet-category">{sweet.category}</span>
                    {sweet.description && (
                      <p className="sweet-description">{sweet.description}</p>
                    )}
                    <div className="sweet-footer">
                      <div>
                        <div className="sweet-price">${sweet.price.toFixed(2)}</div>
                        <div className={`sweet-stock ${sweet.quantity === 0 ? 'out-of-stock' : ''}`}>
                          {sweet.quantity === 0
                            ? 'Out of stock'
                            : `${sweet.quantity} in stock`}
                        </div>
                      </div>
                    </div>
                    <div className="sweet-actions">
                      <input
                        type="number"
                        min="1"
                        max={sweet.quantity}
                        value={purchaseQuantities[sweet._id] || 1}
                        onChange={(e) => handleQuantityChange(sweet._id, e.target.value)}
                        style={{ width: '60px', padding: '8px', textAlign: 'center' }}
                        disabled={sweet.quantity === 0}
                      />
                      <button
                        onClick={() => handlePurchase(sweet)}
                        className="btn btn-success"
                        disabled={sweet.quantity === 0}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
