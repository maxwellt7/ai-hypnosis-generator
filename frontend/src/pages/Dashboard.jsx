import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Dashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-600">AI Hypnosis Generator</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name}</span>
            <button onClick={logout} className="btn btn-primary">
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Your Dashboard</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/create-journey" className="btn btn-primary w-full block text-center">
                  Create New Journey
                </Link>
                <Link to="/onboarding" className="btn bg-gray-200 hover:bg-gray-300 w-full block text-center">
                  Update Profile
                </Link>
              </div>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Your Stats</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Current Streak: <span className="font-bold">0 days</span></p>
                <p className="text-gray-600">Total Minutes: <span className="font-bold">0 min</span></p>
                <p className="text-gray-600">Journeys: <span className="font-bold">0</span></p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-xl font-semibold mb-4">Your Journeys</h3>
            <p className="text-gray-600">No journeys yet. Create your first journey to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

