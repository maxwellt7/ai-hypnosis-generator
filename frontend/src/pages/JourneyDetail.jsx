import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useJourneyStore } from '../store/journeyStore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { CheckCircle2, Circle, Play } from 'lucide-react';

export default function JourneyDetail() {
  const { id } = useParams();
  const { currentJourney, fetchJourney, markDayComplete, isLoading } = useJourneyStore();

  useEffect(() => {
    fetchJourney(id);
  }, [id, fetchJourney]);

  if (isLoading || !currentJourney) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentJourney.goal}</h1>
            <p className="text-gray-600">{currentJourney.intention}</p>
          </div>

          <div className="space-y-4">
            {currentJourney.journey_days?.map((day) => (
              <Card key={day.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {day.completed ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300" />
                      )}
                      <CardTitle>
                        Day {day.day_number}: {day.title || 'Untitled'}
                      </CardTitle>
                    </div>
                    {day.audio_url && !day.completed && (
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => markDayComplete(currentJourney.id, day.day_number)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Listen
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{day.description || 'No description'}</p>
                  {day.completed && (
                    <p className="text-sm text-green-600 mt-2">
                      Completed on {new Date(day.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

