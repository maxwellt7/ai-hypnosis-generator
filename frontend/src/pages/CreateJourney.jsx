import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useJourneyStore } from '../store/journeyStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function CreateJourney() {
  const navigate = useNavigate();
  const { createJourney } = useJourneyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    intention: '',
    duration: 15,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const journey = await createJourney(formData);
      toast.success('Journey creation started!');
      navigate(`/journey/${journey.id}/creating`);
    } catch (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Your 7-Day Journey</CardTitle>
            <p className="text-gray-600">Tell us about your goals and intentions</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Goal (100-500 characters)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  value={formData.goal}
                  onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                  placeholder="e.g., I want to lose 20 pounds and feel confident in my body"
                  required
                  minLength={100}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.goal.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Intention (100-500 characters)
                </label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  value={formData.intention}
                  onChange={(e) => setFormData({ ...formData, intention: e.target.value })}
                  placeholder="e.g., I am creating healthy habits and loving my body"
                  required
                  minLength={100}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.intention.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Session Duration
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                  <option value={30}>30 minutes</option>
                </select>
              </div>

              <Button type="submit" className="w-full" variant="gradient" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Journey'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

