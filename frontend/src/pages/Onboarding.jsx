import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6">Welcome! Let's Get Started</h2>
          <p className="text-gray-600 mb-8">
            Answer a few questions to help us personalize your hypnosis journey.
          </p>
          
          <div className="space-y-4">
            <p className="text-lg font-medium">This is a placeholder for the onboarding wizard.</p>
            <p className="text-gray-600">
              In the full version, this will be a 20-question intake form with AI-powered insights.
            </p>
          </div>
          
          <button
            onClick={() => navigate('/create-journey')}
            className="btn btn-primary mt-8"
          >
            Continue to Journey Creation
          </button>
        </div>
      </div>
    </div>
  );
}

