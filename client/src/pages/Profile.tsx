import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { translations } from '../i18n/translations';
import { getProfilePictureUrl } from '../utils/userUtils';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Save, X } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import toast from 'react-hot-toast';

interface EditableField {
  field: string;
  isEditing: boolean;
}

const Profile = () => {
  const { user, updateUser, isLoading } = useAuthStore();
  const { language } = useLanguageStore();
  const t = translations[language];
  const [editingField, setEditingField] = useState<EditableField>({ field: '', isEditing: false });
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      zipCode: user?.address?.zipCode || '',
      country: user?.address?.country || ''
    }
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || ''
        }
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Please log in to view your profile.
          </p>
        </div>
      </div>
    );
  }

  const handleEdit = (field: string) => {
    setEditingField({ field, isEditing: true });
  };

  const handleCancel = () => {
    setEditingField({ field: '', isEditing: false });
    // Reset form data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      }
    });
  };

  const handleImageUpload = async (imageUrl: string) => {
    try {
      await updateUser({ profilePicture: imageUrl });
      toast.success(t.messages.profileUpdated);
    } catch (error) {
      console.error('Profile picture update error:', error);
      toast.error(t.messages.profileUpdateFailed);
    }
  };

  const handleImageRemove = async () => {
    try {
      await updateUser({ profilePicture: '' });
      toast.success('Profile picture removed successfully');
    } catch (error) {
      console.error('Profile picture removal error:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const handleSave = async (field: string) => {
    try {
      let updateData: any = {};
      
      switch (field) {
        case 'name':
          updateData = { name: formData.name };
          break;
        case 'phone':
          updateData = { phone: formData.phone };
          break;
        case 'address':
          updateData = { address: formData.address };
          break;
      }

      await updateUser(updateData);
      setEditingField({ field: '', isEditing: false });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.profile.myProfile}
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Manage your account settings and personal information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture & Basic Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              {/* Profile Picture */}
                            <div className="flex justify-center mb-4">
                <ImageUpload
                  currentImage={getProfilePictureUrl(user.profilePicture)}
                  onImageUpload={handleImageUpload}
                  onImageRemove={handleImageRemove}
                  size="lg"
                  shape="circle"
                />
              </div>

              {/* Name */}
              <h2 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              
              {/* Role Badge */}
              {user.isAdmin && (
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm"
                     style={{ 
                       background: 'var(--gradient-gold)', 
                       color: 'var(--text-on-gold)' 
                     }}>
                  <Shield className="w-4 h-4 mr-1" />
                  Administrator
                </div>
              )}
              
              {/* Join Date */}
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-1" />
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Account Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Wishlist Items</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user.wishlist?.length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Orders</span>
                <span className="font-semibold text-gray-900 dark:text-white">0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Account Status</span>
                <span className="text-green-600 font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t.profile.personalInformation}
              </h3>
              
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.profile.fullName}
                  </label>
                  <div className="flex items-center space-x-3">
                    {editingField.field === 'name' && editingField.isEditing ? (
                      <>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSave('name')}
                          disabled={isLoading}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 flex-1">
                          <User className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {user.name || 'Not provided'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEdit('name')}
                          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.profile.emailAddress}
                  </label>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {user.email}
                    </span>
                    <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      Cannot be changed
                    </span>
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t.profile.phoneNumber}
                  </label>
                  <div className="flex items-center space-x-3">
                    {editingField.field === 'phone' && editingField.isEditing ? (
                      <>
                        <Phone className="w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter phone number"
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                        />
                        <button
                          onClick={() => handleSave('phone')}
                          disabled={isLoading}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3 flex-1">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {user.phone || 'Not provided'}
                          </span>
                        </div>
                        <button
                          onClick={() => handleEdit('phone')}
                          className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t.profile.addressInformation}
              </h3>
              
              {editingField.field === 'address' && editingField.isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleInputChange('address.street', e.target.value)}
                      placeholder="Enter street address"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.address.city}
                        onChange={(e) => handleInputChange('address.city', e.target.value)}
                        placeholder="Enter city"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        value={formData.address.state}
                        onChange={(e) => handleInputChange('address.state', e.target.value)}
                        placeholder="Enter state"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                        placeholder="Enter ZIP code"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange('address.country', e.target.value)}
                        placeholder="Enter country"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave('address')}
                      disabled={isLoading}
                      className="px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50"
                      style={{ background: 'var(--gradient-gold)' }}
                    >
                      {isLoading ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      {user.address && (user.address.street || user.address.city) ? (
                        <div className="text-gray-900 dark:text-white">
                          {user.address.street && <div>{user.address.street}</div>}
                          <div>
                            {[user.address.city, user.address.state, user.address.zipCode]
                              .filter(Boolean)
                              .join(', ')}
                          </div>
                          {user.address.country && <div>{user.address.country}</div>}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">
                          No address provided
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEdit('address')}
                      className="p-2 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                {t.profile.preferences}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Notifications
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Receive updates about orders and promotions
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={user.preferences?.notifications || false}
                    className="h-4 w-4 text-gold-600 focus:ring-gold-500 border-gray-300 rounded"
                    readOnly
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Currency
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.preferences?.currency || 'USD'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Language
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.preferences?.language || 'English'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;