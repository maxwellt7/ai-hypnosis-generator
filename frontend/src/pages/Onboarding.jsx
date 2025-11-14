import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useProfileStore } from '../store/profileStore';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const questions = [
  {
    id: 'primary_goal',
    label: 'What is your primary goal for using hypnosis?',
    type: 'select',
    options: [
      'Stress & Anxiety Relief',
      'Build Confidence & Self-Esteem',
      'Improve Sleep Quality',
      'Weight Loss & Healthy Habits',
      'Overcome Fears & Phobias',
      'Quit Smoking/Bad Habits',
      'Improve Focus & Performance',
      'Pain Management',
      'Other'
    ]
  },
  {
    id: 'experience_level',
    label: 'Have you experienced hypnosis or meditation before?',
    type: 'select',
    options: ['Never', 'A few times', 'Regularly', 'Daily practice']
  },
  {
    id: 'preferred_time',
    label: 'When do you prefer to listen to hypnosis sessions?',
    type: 'select',
    options: ['Morning', 'Afternoon', 'Evening', 'Before bed', 'Flexible']
  },
  {
    id: 'session_duration',
    label: 'How long should your typical session be?',
    type: 'select',
    options: ['5-10 minutes', '15-20 minutes', '30-45 minutes', '45+ minutes']
  },
  {
    id: 'specific_challenges',
    label: 'Describe any specific challenges you\'d like to address',
    type: 'textarea',
    placeholder: 'E.g., I struggle with public speaking anxiety...'
  },
  {
    id: 'desired_outcome',
    label: 'What would success look like for you in 30 days?',
    type: 'textarea',
    placeholder: 'E.g., I would feel calm and confident in social situations...'
  },
  {
    id: 'voice_preference',
    label: 'What type of voice do you prefer?',
    type: 'select',
    options: ['Calm & Soothing', 'Warm & Friendly', 'Confident & Authoritative', 'Gentle & Soft', 'No preference']
  },
  {
    id: 'background_sounds',
    label: 'Do you prefer background music or sounds?',
    type: 'select',
    options: ['Nature sounds', 'Soft music', 'Binaural beats', 'Silence', 'No preference']
  },
  {
    id: 'stress_level',
    label: 'On a scale of 1-10, what is your current stress level?',
    type: 'select',
    options: ['1 - Very Low', '2', '3', '4', '5 - Moderate', '6', '7', '8', '9', '10 - Very High']
  },
  {
    id: 'sleep_quality',
    label: 'How would you rate your sleep quality?',
    type: 'select',
    options: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  },
  {
    id: 'past_trauma',
    label: 'Are there any past experiences that still affect you today?',
    type: 'textarea',
    placeholder: 'Optional - share only if comfortable...',
    optional: true
  },
  {
    id: 'current_medications',
    label: 'Are you currently taking any medications or under medical care?',
    type: 'select',
    options: ['No', 'Yes - Physical health', 'Yes - Mental health', 'Yes - Both', 'Prefer not to say']
  },
  {
    id: 'commitment_level',
    label: 'How many days per week can you commit to sessions?',
    type: 'select',
    options: ['1-2 days', '3-4 days', '5-6 days', 'Every day']
  },
  {
    id: 'motivational_style',
    label: 'What motivates you most?',
    type: 'select',
    options: ['Positive reinforcement', 'Practical results', 'Emotional connection', 'Scientific evidence', 'All of the above']
  },
  {
    id: 'relaxation_level',
    label: 'How easily do you relax?',
    type: 'select',
    options: ['Very difficult', 'Somewhat difficult', 'Neutral', 'Somewhat easy', 'Very easy']
  },
  {
    id: 'visualization_ability',
    label: 'How well can you visualize scenarios in your mind?',
    type: 'select',
    options: ['Not at all', 'With difficulty', 'Moderately well', 'Very well', 'Extremely vivid']
  },
  {
    id: 'personal_values',
    label: 'What matters most to you in life?',
    type: 'textarea',
    placeholder: 'E.g., Family, health, career, creativity, freedom...'
  },
  {
    id: 'biggest_obstacle',
    label: 'What\'s the biggest obstacle preventing you from reaching your goals?',
    type: 'textarea',
    placeholder: 'Be honest with yourself...'
  },
  {
    id: 'support_system',
    label: 'Do you have a support system?',
    type: 'select',
    options: ['Strong support system', 'Some support', 'Limited support', 'No support', 'Prefer not to say']
  },
  {
    id: 'additional_info',
    label: 'Anything else you\'d like us to know?',
    type: 'textarea',
    placeholder: 'Optional - any additional context that might help personalize your experience...',
    optional: true
  }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { completeOnboarding } = useProfileStore();
  const { updateUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentStep * questionsPerPage,
    (currentStep + 1) * questionsPerPage
  );

  const handleChange = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value });
  };

  const canGoNext = () => {
    return currentQuestions.every(q => {
      if (q.optional) return true;
      return responses[q.id] && responses[q.id].trim() !== '';
    });
  };

  const handleNext = () => {
    if (currentStep < totalPages - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canGoNext()) {
      toast.error('Please answer all required questions');
      return;
    }

    setIsLoading(true);

    try {
      const profile = await completeOnboarding({ responses });
      
      // Update user in auth store with new profile
      updateUser((prev) => ({ ...prev, profile }));
      
      toast.success('Profile created! Let\'s create your first journey.');
      navigate('/create-journey');
    } catch (error) {
      toast.error(error.message || 'Failed to complete onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="container mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Welcome! Let's Personalize Your Experience</CardTitle>
            <p className="text-gray-600">
              Answer these questions to help us create the perfect hypnosis journeys for you
            </p>
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Step {currentStep + 1} of {totalPages}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(((currentStep + 1) / totalPages) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / totalPages) * 100}%` }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {currentQuestions.map((question, idx) => (
                <div key={question.id} className="space-y-2">
                  <label className="block text-sm font-medium">
                    {idx + 1 + currentStep * questionsPerPage}. {question.label}
                    {question.optional && (
                      <span className="text-gray-400 ml-2">(Optional)</span>
                    )}
                  </label>
                  
                  {question.type === 'select' && (
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={responses[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required={!question.optional}
                    >
                      <option value="">Select an option...</option>
                      {question.options.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {question.type === 'textarea' && (
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px]"
                      placeholder={question.placeholder}
                      value={responses[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required={!question.optional}
                    />
                  )}

                  {question.type === 'text' && (
                    <Input
                      placeholder={question.placeholder}
                      value={responses[question.id] || ''}
                      onChange={(e) => handleChange(question.id, e.target.value)}
                      required={!question.optional}
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-4 pt-6">
                {currentStep > 0 && (
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}

                {currentStep < totalPages - 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    variant="gradient"
                    className="flex-1"
                    disabled={!canGoNext()}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="gradient"
                    className="flex-1"
                    disabled={isLoading || !canGoNext()}
                  >
                    {isLoading ? 'Completing...' : 'Complete & Continue'}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

