import { useState } from 'react';
import axios from 'axios';

function Signup({ onSignupSuccess, onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { strength: 0, text: '', color: '' };
    if (pwd.length < 6) return { strength: 1, text: 'Weak', color: 'text-red-600' };
    if (pwd.length < 10) return { strength: 2, text: 'Fair', color: 'text-yellow-600' };
    return { strength: 3, text: 'Strong', color: 'text-green-600' };
  };

  const passwordStrength = getPasswordStrength(password);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        'http://localhost:5000/api/auth/signup',
        { email, password }
      );

      alert('✅ Account created successfully! Now login.');
      onSignupSuccess();

    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-8">
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Start tracking your job journey today</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              📧 Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🔒 Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            
            {password && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all ${
                      passwordStrength.strength === 1 ? 'bg-red-500 w-1/3' :
                      passwordStrength.strength === 2 ? 'bg-yellow-500 w-2/3' :
                      'bg-green-500 w-full'
                    }`}
                  ></div>
                </div>
                <span className={`text-sm font-semibold ${passwordStrength.color}`}>
                  {passwordStrength.text}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              🔒 Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-md hover:shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>

        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Already have an account?</span>
          </div>
        </div>

        <button
          onClick={onSwitchToLogin}
          className="w-full bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 font-semibold py-2.5 rounded-lg hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border border-gray-200"
        >
          Login instead
        </button>

      </div>

      <p className="text-center text-gray-500 text-xs mt-6">
        By signing up, you agree to our Terms & Privacy Policy
      </p>
    </div>
  );
}

export default Signup;