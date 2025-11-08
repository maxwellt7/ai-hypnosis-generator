import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function JourneyCreating() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // In production, this would poll the API for journey status
    // For now, just show the loading screen
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="card max-w-2xl w-full text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-6"></div>
        
        <h2 className="text-3xl font-bold mb-4">Creating Your Journey...</h2>
        
        <div className="space-y-3 text-gray-600 mb-8">
          <p className="animate-pulse">Analyzing your profile...</p>
          <p>Researching best practices...</p>
          <p>Crafting your personalized script...</p>
          <p>Generating audio tracks...</p>
        </div>
        
        <p className="text-sm text-gray-500">
          This usually takes 5-10 minutes. You'll receive an email when it's ready!
        </p>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="btn bg-gray-200 hover:bg-gray-300 mt-8"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}

