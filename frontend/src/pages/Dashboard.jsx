import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useJourneyStore } from '../store/journeyStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Plus, Sparkles, TrendingUp, Calendar } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { journeys, fetchJourneys, isLoading } = useJourneyStore();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold gradient-text">Hypnosis Generator</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/stats">
              <Button variant="ghost">Stats</Button>
            </Link>
            <Link to="/dashboard/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">Ready to continue your transformation journey?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Journeys</CardTitle>
              <Calendar className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journeys.filter(j => j.status === 'ready').length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Journeys</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journeys.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Streak</CardTitle>
              <span className="text-2xl">🔥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0 days</div>
            </CardContent>
          </Card>
        </div>

        {/* Create Journey CTA */}
        <div className="mb-8">
          <Link to="/create-journey">
            <Button size="lg" variant="gradient" className="w-full md:w-auto">
              <Plus className="h-5 w-5 mr-2" />
              Create New Journey
            </Button>
          </Link>
        </div>

        {/* Journeys List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Journeys</h2>
          {journeys.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500 mb-4">No journeys yet. Create your first one!</p>
                <Link to="/create-journey">
                  <Button variant="gradient">Get Started</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {journeys.map((journey) => (
                <Link key={journey.id} to={`/dashboard/journey/${journey.id}`}>
                  <Card className="card-hover cursor-pointer">
                    <CardHeader>
                      <CardTitle>{journey.goal}</CardTitle>
                      <p className="text-sm text-gray-600">{journey.intention}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          journey.status === 'ready' ? 'bg-green-100 text-green-700' :
                          journey.status === 'creating' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {journey.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {journey.journey_days?.filter(d => d.completed).length || 0}/7 days
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

