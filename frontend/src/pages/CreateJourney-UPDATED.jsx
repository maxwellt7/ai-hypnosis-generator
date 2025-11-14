/**
 * Create Journey Page - Updated for N8N Integration
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJourneyWithN8N, pollJourneyStatus } from '../services/n8n-journey.service';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

export const CreateJourney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    goal: '',
    intention: '',
    duration: 15,
    userProfile: {
      timePreference: 'evening',
      onboardingData: {}
    }
  });

  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setProgress(0);
    setError(null);
    setStatusMessage('Initializing journey creation...');

    try {
      // Step 1: Create journey and trigger n8n (10%)
      setProgress(10);
      setStatusMessage('Creating your journey...');
      
      const result = await createJourneyWithN8N({
        ...formData,
        userProfile: {
          ...formData.userProfile,
          userName: user?.name || 'User'
        }
      });

      setProgress(15);
      setStatusMessage('Journey created! Starting script generation...');
      
      // Step 2: Poll for completion (15% -> 95%)
      await pollJourneyStatus(
        result.journeyId,
        (journey) => {
          // Update progress based on journey status
          if (journey.status === 'processing') {
            // Calculate progress based on completed days
            const completedDays = journey.days?.filter(d => d.audioUrl)?.length || 0;
            const dayProgress = (completedDays / 7) * 75; // 75% of total progress
            setProgress(15 + dayProgress);
            setStatusMessage(`Generating Day ${completedDays + 1} of 7...`);
          } else if (journey.status === 'completed') {
            setProgress(95);
            setStatusMessage('Journey complete! Finalizing...');
          }
        },
        180 // 15 minutes max
      );

      // Step 3: Complete (100%)
      setProgress(100);
      setStatusMessage('Journey ready! Redirecting...');

      // Navigate to journey detail page
      setTimeout(() => {
        navigate(`/journey/${result.journeyId}`);
      }, 1500);

    } catch (error) {
      console.error('Failed to create journey:', error);
      setError(error.message || 'Failed to create journey. Please try again.');
      setStatusMessage('');
      setProgress(0);
    } finally {
      setTimeout(() => {
        if (!error) {
          setGenerating(false);
        }
      }, 2000);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        [field]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create Your Hypnosis Journey
          </h1>
          <p className="text-gray-600">
            Personalized 7-day transformation journey
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          {generating ? (
            /* Generation Progress */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mb-4"></div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Creating Your Journey
                </h2>
                <p className="text-gray-600 mb-6">{statusMessage}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{progress}%</p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take 5-10 minutes. You can close this page and come back later.
                </p>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3 mt-8">
                <StatusItem 
                  label="Journey Created" 
                  completed={progress >= 15} 
                  active={progress < 15}
                />
                <StatusItem 
                  label="Generating Scripts (7 days)" 
                  completed={progress >= 90} 
                  active={progress >= 15 && progress < 90}
                />
                <StatusItem 
                  label="Creating Audio" 
                  completed={progress >= 95} 
                  active={progress >= 90 && progress < 95}
                />
                <StatusItem 
                  label="Finalizing Journey" 
                  completed={progress >= 100} 
                  active={progress >= 95 && progress < 100}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                  <Button
                    onClick={() => {
                      setError(null);
                      setGenerating(false);
                      setProgress(0);
                    }}
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          ) : (
            /* Creation Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              {/* Goal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What is your goal? *
                </label>
                <Input
                  type="text"
                  value={formData.goal}
                  onChange={(e) => handleChange('goal', e.target.value)}
                  placeholder="e.g., Reduce stress and anxiety"
                  className="w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific about what you want to achieve
                </p>
              </div>

              {/* Intention */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  What is your intention? *
                </label>
                <textarea
                  value={formData.intention}
                  onChange={(e) => handleChange('intention', e.target.value)}
                  placeholder="e.g., I want to feel calm, peaceful, and in control of my emotions..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32 resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Describe how you want to feel and what change means to you
                </p>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Session Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes (Recommended)</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                </select>
              </div>

              {/* Time Preference */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  When will you listen?
                </label>
                <select
                  value={formData.userProfile.timePreference}
                  onChange={(e) => handleProfileChange('timePreference', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening (Recommended)</option>
                  <option value="night">Before Sleep</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-4 text-lg font-semibold rounded-lg shadow-lg transition-all"
                disabled={!formData.goal || !formData.intention}
              >
                Create My Journey ✨
              </Button>

              <p className="text-xs text-center text-gray-500">
                Generation takes 5-10 minutes. You'll be notified when ready.
              </p>
            </form>
          )}
        </Card>

        {/* Info Cards */}
        {!generating && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <InfoCard
              icon="🎯"
              title="Personalized"
              description="Tailored to your specific goals and preferences"
            />
            <InfoCard
              icon="🎧"
              title="Professional"
              description="AI-generated scripts with studio-quality audio"
            />
            <InfoCard
              icon="📅"
              title="7-Day Journey"
              description="Progressive daily sessions for lasting change"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Status Item Component
const StatusItem = ({ label, completed, active }) => (
  <div className="flex items-center space-x-3">
    <div className={`
      w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
      ${completed ? 'bg-green-500' : active ? 'bg-purple-500 animate-pulse' : 'bg-gray-300'}
    `}>
      {completed && (
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
    <span className={`text-sm ${completed ? 'text-green-700 font-medium' : active ? 'text-purple-700 font-medium' : 'text-gray-500'}`}>
      {label}
    </span>
  </div>
);

// Info Card Component
const InfoCard = ({ icon, title, description }) => (
  <Card className="p-4 text-center hover:shadow-lg transition-shadow">
    <div className="text-3xl mb-2">{icon}</div>
    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-xs text-gray-600">{description}</p>
  </Card>
);

export default CreateJourney;

