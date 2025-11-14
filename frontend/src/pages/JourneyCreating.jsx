import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJourneyStore } from '../store/journeyStore';
import LoadingSpinner from '../components/common/LoadingSpinner';

const messages = [
  'Analyzing your profile...',
  'Researching best practices...',
  'Crafting your personalized script...',
  'Generating audio tracks...',
  'Finalizing your 7-day journey...',
];

export default function JourneyCreating() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchJourney } = useJourneyStore();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    const checkTimer = setInterval(async () => {
      try {
        const journey = await fetchJourney(id);
        if (journey.status === 'ready') {
          navigate(`/dashboard/journey/${id}`);
        }
      } catch (error) {
        console.error('Error checking journey status:', error);
      }
    }, 5000);

    return () => {
      clearInterval(messageTimer);
      clearInterval(checkTimer);
    };
  }, [id, fetchJourney, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-6">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-8" />
        <h2 className="text-3xl font-bold mb-4 gradient-text">Creating Your Journey</h2>
        <p className="text-xl text-gray-600 mb-8">{messages[messageIndex]}</p>
        <p className="text-sm text-gray-500">This typically takes 5-10 minutes</p>
      </div>
    </div>
  );
}

