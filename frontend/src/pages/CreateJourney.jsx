import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function CreateJourney() {
  const [goal, setGoal] = useState('');
  const [intention, setIntention] = useState('');
  const [duration, setDuration] = useState(15);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/journeys', { goal, intention, duration });
      const { journey } = response.data;
      
      navigate(`/journey/${journey.id}/creating`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create journey');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6">Create Your Journey</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                What is your goal?
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="input min-h-[100px]"
                placeholder="E.g., I want to lose 20 pounds and feel confident in my body"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                What is your intention?
              </label>
              <textarea
                value={intention}
                onChange={(e) => setIntention(e.target.value)}
                className="input min-h-[100px]"
                placeholder="E.g., I am creating healthy habits and loving my body"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Preferred session duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="input"
              >
                <option value={5}>5 minutes</option>
                <option value={10}>10 minutes</option>
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating...' : 'Create Journey'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

