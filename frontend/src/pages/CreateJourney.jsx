import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useJourneyStore } from '../store/journeyStore';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { subscriptionService } from '../services/subscription.service';

export default function CreateJourney() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isNewSubscriber = searchParams.get('welcome') === 'true';
  const { createJourney } = useJourneyStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: '',
    intention: '',
    duration: 15,
  });

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const url = await subscriptionService.startCheckout();
      window.location.href = url;
    } catch {
      toast.error('Failed to start checkout. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const journey = await createJourney(formData);
      toast.success('Journey creation started!');
      navigate(`/journey/${journey.id}/creating`);
    } catch (error) {
      if (error.status === 402) {
        setShowPaywall(true);
        setIsLoading(false);
        return;
      }
      toast.error(error.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-2xl">
        {isNewSubscriber && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 px-5 py-4">
            <p className="text-green-800 font-semibold text-sm">Payment confirmed — welcome to Sacred Heart!</p>
            <p className="text-green-700 text-sm mt-1">Create your first 7-day hypnosis journey below to get started.</p>
          </div>
        )}
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

        {/* Subscription paywall modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Unlock Unlimited Journeys</CardTitle>
                <p className="text-sm text-gray-500">You've used your free journey. Subscribe to continue your transformation.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-2">
                  <p className="text-3xl font-bold">$29<span className="text-base font-normal text-gray-500">/month</span></p>
                  <p className="text-sm text-gray-500 mt-1">Unlimited journeys · Cancel anytime</p>
                </div>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>✓ Unlimited personalized 7-day journeys</li>
                  <li>✓ AI-generated hypnotic audio sessions</li>
                  <li>✓ Progress tracking & analytics</li>
                </ul>
                <Button className="w-full" onClick={handleCheckout} disabled={checkoutLoading}>
                  {checkoutLoading ? 'Redirecting to checkout…' : 'Subscribe — $29/mo'}
                </Button>
                <button
                  className="w-full text-sm text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPaywall(false)}
                >
                  Maybe later
                </button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

