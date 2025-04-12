import React, { useState } from 'react';
import { Save, RefreshCw, Database, Globe, CreditCard, Bell, Shield, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SettingsPage: React.FC = () => {
  const { supabase } = useAuth();
  
  // Site settings
  const [siteName, setSiteName] = useState('TilkTibeb');
  const [siteDescription, setSiteDescription] = useState('Book summaries and business plans platform');
  const [siteUrl, setSiteUrl] = useState('https://tilktibeb.com');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [faviconUrl, setFaviconUrl] = useState('/favicon.ico');
  
  // Payment settings
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [chapaApiKey, setChapaApiKey] = useState('test_pk_***********************');
  const [chapaSecretKey, setChapaSecretKey] = useState('test_sk_***********************');
  const [defaultBookPrice, setDefaultBookPrice] = useState('9.99');
  const [defaultPlanPrice, setDefaultPlanPrice] = useState('29.99');
  
  // Email settings
  const [emailSender, setEmailSender] = useState('no-reply@tilktibeb.com');
  const [emailTemplate, setEmailTemplate] = useState('<p>Hello {{name}},</p><p>{{message}}</p><p>Best regards,<br>TilkTibeb Team</p>');
  
  // Security settings
  const [registrationEnabled, setRegistrationEnabled] = useState(true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('24');
  
  // Notification settings
  const [newUserNotification, setNewUserNotification] = useState(true);
  const [newPurchaseNotification, setNewPurchaseNotification] = useState(true);
  const [failedPaymentNotification, setFailedPaymentNotification] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would call the API to save the settings
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold gold-text">Settings</h1>
        <p className="text-gray-400">Configure your application settings</p>
      </div>
      
      <form onSubmit={handleSaveSettings}>
        {/* Site Settings */}
        <div className="admin-card mb-6">
          <div className="flex items-center mb-4">
            <Globe size={20} className="text-[#c9a52c] mr-2" />
            <h2 className="text-xl font-bold">Site Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="siteName" className="admin-label">Site Name</label>
              <input
                type="text"
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label htmlFor="siteUrl" className="admin-label">Site URL</label>
              <input
                type="url"
                id="siteUrl"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="siteDescription" className="admin-label">Site Description</label>
            <input
              type="text"
              id="siteDescription"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              className="admin-input"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="logoUrl" className="admin-label">Logo URL</label>
              <input
                type="text"
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label htmlFor="faviconUrl" className="admin-label">Favicon URL</label>
              <input
                type="text"
                id="faviconUrl"
                value={faviconUrl}
                onChange={(e) => setFaviconUrl(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
        </div>
        
        {/* Payment Settings */}
        <div className="admin-card mb-6">
          <div className="flex items-center mb-4">
            <CreditCard size={20} className="text-[#c9a52c] mr-2" />
            <h2 className="text-xl font-bold">Payment Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="currencyCode" className="admin-label">Currency</label>
              <select
                id="currencyCode"
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="admin-select"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="ETB">ETB - Ethiopian Birr</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="defaultBookPrice" className="admin-label">Default Book Price</label>
              <input
                type="text"
                id="defaultBookPrice"
                value={defaultBookPrice}
                onChange={(e) => setDefaultBookPrice(e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label htmlFor="defaultPlanPrice" className="admin-label">Default Plan Price</label>
              <input
                type="text"
                id="defaultPlanPrice"
                value={defaultPlanPrice}
                onChange={(e) => setDefaultPlanPrice(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="chapaApiKey" className="admin-label">Chapa API Key</label>
              <input
                type="password"
                id="chapaApiKey"
                value={chapaApiKey}
                onChange={(e) => setChapaApiKey(e.target.value)}
                className="admin-input"
              />
            </div>
            
            <div>
              <label htmlFor="chapaSecretKey" className="admin-label">Chapa Secret Key</label>
              <input
                type="password"
                id="chapaSecretKey"
                value={chapaSecretKey}
                onChange={(e) => setChapaSecretKey(e.target.value)}
                className="admin-input"
              />
            </div>
          </div>
        </div>
        
        {/* Email Settings */}
        <div className="admin-card mb-6">
          <div className="flex items-center mb-4">
            <Mail size={20} className="text-[#c9a52c] mr-2" />
            <h2 className="text-xl font-bold">Email Settings</h2>
          </div>
          
          <div className="mb-4">
            <label htmlFor="emailSender" className="admin-label">Sender Email</label>
            <input
              type="email"
              id="emailSender"
              value={emailSender}
              onChange={(e) => setEmailSender(e.target.value)}
              className="admin-input"
            />
          </div>
          
          <div>
            <label htmlFor="emailTemplate" className="admin-label">Email Template</label>
            <textarea
              id="emailTemplate"
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="admin-textarea"
              rows={5}
            />
            <p className="text-sm text-gray-400 mt-1">
              Use {{name}} for user name and {{message}} for the email message.
            </p>
          </div>
        </div>
        
        {/* Security Settings */}
        <div className="admin-card mb-6">
          <div className="flex items-center mb-4">
            <Shield size={20} className="text-[#c9a52c] mr-2" />
            <h2 className="text-xl font-bold">Security Settings</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="registrationEnabled"
                checked={registrationEnabled}
                onChange={(e) => setRegistrationEnabled(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="registrationEnabled" className="cursor-pointer">
                Enable User Registration
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireEmailVerification"
                checked={requireEmailVerification}
                onChange={(e) => setRequireEmailVerification(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="requireEmailVerification" className="cursor-pointer">
                Require Email Verification
              </label>
            </div>
          </div>
          
          <div>
            <label htmlFor="sessionTimeout" className="admin-label">Session Timeout (hours)</label>
            <input
              type="number"
              id="sessionTimeout"
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="admin-input"
              min="1"
              max="168"
            />
          </div>
        </div>
        
        {/* Notification Settings */}
        <div className="admin-card mb-6">
          <div className="flex items-center mb-4">
            <Bell size={20} className="text-[#c9a52c] mr-2" />
            <h2 className="text-xl font-bold">Notification Settings</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newUserNotification"
                checked={newUserNotification}
                onChange={(e) => setNewUserNotification(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="newUserNotification" className="cursor-pointer">
                Notify on new user registration
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newPurchaseNotification"
                checked={newPurchaseNotification}
                onChange={(e) => setNewPurchaseNotification(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="newPurchaseNotification" className="cursor-pointer">
                Notify on new purchase
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="failedPaymentNotification"
                checked={failedPaymentNotification}
                onChange={(e) => setFailedPaymentNotification(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="failedPaymentNotification" className="cursor-pointer">
                Notify on failed payment
              </label>
            </div>
          </div>
        </div>
        
        {/* Database Settings */}
        <div className="admin-card mb-6">
          <div className="flex items-center mb-4">
            <Database size={20} className="text-[#c9a52c] mr-2" />
            <h2 className="text-xl font-bold">Database Operations</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="secondary-button flex items-center"
              onClick={() => {
                if (window.confirm('Are you sure you want to backup the database? This may take a few minutes.')) {
                  // In a real implementation, you would call the API to backup the database
                  alert('Database backup started. You will be notified when it completes.');
                }
              }}
            >
              <Database size={18} className="mr-2" />
              Backup Database
            </button>
            
            <button
              type="button"
              className="secondary-button flex items-center"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear the cache? This may temporarily slow down the application.')) {
                  // In a real implementation, you would call the API to clear the cache
                  alert('Cache cleared successfully.');
                }
              }}
            >
              <RefreshCw size={18} className="mr-2" />
              Clear Cache
            </button>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="gold-button flex items-center"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2d1e14] mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} className="mr-2" />
                Save Settings
              </>
            )}
          </button>
        </div>
        
        {saveSuccess && (
          <div className="mt-4 bg-green-900/30 border border-green-500/50 text-green-200 px-4 py-3 rounded-md">
            Settings saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default SettingsPage;
