import { useState, useEffect } from 'react';
import { useSweet } from '../context/SweetContext';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const {
    sweets,
    loading,
    fetchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    restockSweet
  } = useSweet();

  const [showModal, setShowModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'chocolate',
    price: '',
    quantity: '',
    description: '',
    imageUrl: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'chocolate',
      price: '',
      quantity: '',
      description: '',
      imageUrl: ''
    });
    setEditingSweet(null);
  };

  const handleOpenModal = (sweet = null) => {
    if (sweet) {
      setEditingSweet(sweet);
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: sweet.price,
        quantity: sweet.quantity,
        description: sweet.description || '',
        imageUrl: sweet.imageUrl || ''
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sweetData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };

    let result;
    if (editingSweet) {
      result = await updateSweet(editingSweet._id, sweetData);
    } else {
      result = await createSweet(sweetData);
    }

    if (result.success) {
      setMessage({
        type: 'success',
        text: `Sweet ${editingSweet ? 'updated' : 'created'} successfully!`
      });
      handleCloseModal();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({
        type: 'error',
        text: result.error
      });
    }
  };

  const handleDelete = async (sweetId) => {
    if (window.confirm('Are you sure you want to delete this sweet?')) {
      const result = await deleteSweet(sweetId);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Sweet deleted successfully!'
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error
        });
      }
    }
  };

  const handleRestock = async (sweetId) => {
    const quantity = prompt('Enter quantity to restock:');
    if (quantity && parseInt(quantity) > 0) {
      const result = await restockSweet(sweetId, parseInt(quantity));
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: `Restocked successfully!`
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else {
        setMessage({
          type: 'error',
          text: result.error
        });
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-panel">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1 className="dashboard-title">Admin Panel</h1>
              <p className="dashboard-subtitle">Manage your sweet inventory</p>
            </div>
            <button onClick={() => handleOpenModal()} className="btn btn-primary">
              ➕ Add New Sweet
            </button>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          ) : sweets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🍭</div>
              <h2 className="empty-state-title">No sweets yet</h2>
              <p className="empty-state-text">
                Start by adding your first sweet to the inventory.
              </p>
              <button onClick={() => handleOpenModal()} className="btn btn-primary">
                Add Sweet
              </button>
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
                        <div className="sweet-stock">Stock: {sweet.quantity}</div>
                      </div>
                    </div>
                    <div className="sweet-actions">
                      <button
                        onClick={() => handleOpenModal(sweet)}
                        className="btn btn-secondary"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleRestock(sweet._id)}
                        className="btn btn-success"
                      >
                        📦 Restock
                      </button>
                      <button
                        onClick={() => handleDelete(sweet._id)}
                        className="btn btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
              </h2>
              <button onClick={handleCloseModal} className="modal-close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="name">Sweet Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="chocolate">Chocolate</option>
                  <option value="candy">Candy</option>
                  <option value="gummy">Gummy</option>
                  <option value="lollipop">Lollipop</option>
                  <option value="hard-candy">Hard Candy</option>
                  <option value="toffee">Toffee</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="input-group">
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSweet ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPanel;
