import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Sparkles, Brain, Headphones, TrendingUp } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold gradient-text">Hypnosis Generator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="gradient">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Transform Your Mind with
            <span className="gradient-text"> AI-Powered Hypnosis</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get personalized 7-day hypnosis journeys tailored to your goals. 
            Let AI create custom sessions that evolve with your progress.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" variant="gradient" className="text-lg px-8 py-4">
                Start Your Journey
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI-Personalized"
            description="Every session is uniquely crafted for your specific goals and preferences"
          />
          <FeatureCard
            icon={<Headphones className="h-8 w-8" />}
            title="Professional Audio"
            description="High-quality audio generated with natural voice synthesis"
          />
          <FeatureCard
            icon={<TrendingUp className="h-8 w-8" />}
            title="Track Progress"
            description="See your improvements with detailed analytics and insights"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center text-gray-600">
        <p>&copy; 2025 Hypnosis Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg card-hover">
      <div className="text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

