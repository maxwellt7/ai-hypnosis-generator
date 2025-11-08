import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            AI Hypnosis Generator
          </h1>
          <p className="text-2xl text-gray-700 mb-8">
            Personalized 7-day hypnosis journeys powered by AI
          </p>
          <p className="text-lg text-gray-600 mb-12">
            Transform your life with custom hypnosis tracks tailored to your goals, 
            preferences, and personal journey.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              to="/register" 
              className="btn btn-primary text-lg px-8 py-3"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="btn bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 text-lg px-8 py-3"
            >
              Sign In
            </Link>
          </div>
          
          <div className="mt-20 grid md:grid-cols-3 gap-8">
            <div className="card">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Personalized</h3>
              <p className="text-gray-600">
                AI-powered scripts tailored to your unique goals and preferences
              </p>
            </div>
            
            <div className="card">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-xl font-semibold mb-2">Professional Audio</h3>
              <p className="text-gray-600">
                High-quality voice synthesis with calming background sounds
              </p>
            </div>
            
            <div className="card">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-gray-600">
                Monitor your journey with stats, streaks, and insights
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

