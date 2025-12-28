import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const AdminEditModal = ({ isOpen, onClose, listing, onSave }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (listing) {
      setFormData({
        ...listing,
        tags: Array.isArray(listing.tags) ? listing.tags : [],
        discount: listing.discount || 'N/A'
      });
    }
  }, [listing]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/businesses/${listing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to update');
      onSave();
      onClose();
    } catch (err) {
      alert('Error updating business: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Edit Business</h3>
              
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input type="text" name="business_name" value={formData.business_name || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select name="category" value={formData.category || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">Select...</option>
                        {["Technology & IT", "Health & Wellness", "Education & Tutoring", "Food & Beverage", "Professional Services", "Creative & Arts", "Retail & Shopping", "Manufacturing & Industry", "Construction & Trades", "Automotive", "Real Estate", "Finance & Insurance", "Legal Services", "Other"].map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Discount</label>
                     <select name="discount" value={formData.discount || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="N/A">N/A</option>
                        {["5%", "10%", "15%", "20%", "25%", "30%", "40%", "50%"].map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea name="description" rows="3" value={formData.description || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Surname (Owner)</label>
                    <input type="text" name="surname" value={formData.surname || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                 <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status || 'pending'} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    <div className="flex items-center mt-1">
                        <input type="checkbox" name="show_email" checked={formData.show_email || false} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label className="ml-2 block text-xs text-gray-500">Show Publicly</label>
                    </div>
                </div>

                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                     <div className="flex items-center mt-1">
                        <input type="checkbox" name="show_phone" checked={formData.show_phone || false} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                        <label className="ml-2 block text-xs text-gray-500">Show Publicly</label>
                    </div>
                </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input type="text" name="website" value={formData.website || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Logo URL</label>
                    <input type="text" name="logo_url" value={formData.logo_url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                 <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Background URL</label>
                    <input type="text" name="background_url" value={formData.background_url || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                </div>

                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input 
                        type="text" 
                        name="tags_input" 
                        value={formData.tags_input !== undefined ? formData.tags_input : (Array.isArray(formData.tags) ? formData.tags.join(', ') : '')} 
                        onChange={(e) => setFormData({...formData, tags_input: e.target.value, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                        placeholder="Tag1, Tag2, Tag3"
                    />
                </div>

              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="submit" disabled={loading} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditModal;
