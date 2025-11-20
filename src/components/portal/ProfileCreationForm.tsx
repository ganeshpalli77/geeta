import { useState } from 'react';
import { User, Calendar, IdCard, Globe, School } from 'lucide-react';
import { Button } from '../ui/button';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner@2.0.3';
import { motion } from 'motion/react';

export function ProfileCreationForm() {
  const { createProfile } = useApp();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    prn: '',
    dob: '',
    category: '',
    preferredLanguage: 'english',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    if (!formData.prn.trim()) {
      toast.error('Please enter your PRN/ID');
      return;
    }
    if (!formData.dob) {
      toast.error('Please select your date of birth');
      return;
    }

    setLoading(true);
    try {
      await createProfile({
        name: formData.name.trim(),
        prn: formData.prn.trim(),
        dob: formData.dob,
        category: formData.category.trim() || 'General',
        preferredLanguage: formData.preferredLanguage,
      });
      toast.success('⚔️ Warrior profile created! Welcome to the arena! 🏆');
    } catch (error) {
      console.error('Error creating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create profile';
      toast.error(errorMessage.replace('API call failed: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto"
    >
      <div className="p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-950/20 dark:to-pink-950/20 border-2 border-orange-300 dark:border-orange-800">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center mx-auto mb-4"
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
            Create Your Warrior Profile ⚔️
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-semibold">
            Begin your journey to glory! Fill in your details below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <User className="inline w-4 h-4 mr-2" />
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none transition-colors font-semibold"
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>

          {/* PRN */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <IdCard className="inline w-4 h-4 mr-2" />
              PRN / Student ID *
            </label>
            <input
              type="text"
              value={formData.prn}
              onChange={(e) => setFormData({ ...formData, prn: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none transition-colors font-semibold"
              placeholder="Enter your PRN or Student ID"
              disabled={loading}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-2" />
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none transition-colors font-semibold"
              disabled={loading}
            />
          </div>

          {/* Category/School */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <School className="inline w-4 h-4 mr-2" />
              School / Category (Optional)
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none transition-colors font-semibold"
              placeholder="Enter your school name or category"
              disabled={loading}
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              <Globe className="inline w-4 h-4 mr-2" />
              Preferred Language *
            </label>
            <select
              value={formData.preferredLanguage}
              onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-orange-500 dark:focus:border-orange-500 focus:outline-none transition-colors font-semibold"
              disabled={loading}
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
            </select>
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 via-pink-600 to-red-600 hover:from-orange-600 hover:via-pink-700 hover:to-red-700 text-white py-4 rounded-xl font-black text-lg shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚔️</span>
                  Creating Warrior Profile...
                </>
              ) : (
                <>
                  ⚔️ Create Profile & Enter Arena
                </>
              )}
            </Button>
          </motion.div>
        </form>

        {/* Info */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold">
            <span className="text-blue-600 dark:text-blue-400 mr-2">ℹ️</span>
            Your profile is your warrior identity in the Geeta Olympiad. You can create multiple profiles if needed.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
