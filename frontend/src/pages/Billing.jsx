import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { subscriptionService } from '../services/subscription.service';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

const STATUS_LABELS = {
  active: { text: 'Active', color: 'text-green-600' },
  trialing: { text: 'Trial', color: 'text-blue-600' },
  past_due: { text: 'Payment Due', color: 'text-yellow-600' },
  cancelled: { text: 'Cancelled', color: 'text-red-600' },
  none: { text: 'Free Tier', color: 'text-gray-600' },
};

export default function Billing() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      toast.success('Subscription activated! Welcome to Sacred Heart.');
    } else if (searchParams.get('checkout') === 'cancelled') {
      toast.info('Checkout cancelled. No charge was made.');
    }
  }, [searchParams]);

  useEffect(() => {
    subscriptionService.getStatus()
      .then(setStatus)
      .catch(() => toast.error('Failed to load subscription status'))
      .finally(() => setLoading(false));
  }, []);

  const handleCheckout = async () => {
    setActionLoading(true);
    try {
      const url = await subscriptionService.startCheckout();
      window.location.href = url;
    } catch {
      toast.error('Failed to start checkout. Please try again.');
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    setActionLoading(true);
    try {
      const url = await subscriptionService.openPortal();
      window.location.href = url;
    } catch {
      toast.error('Failed to open billing portal.');
      setActionLoading(false);
    }
  };

  const label = STATUS_LABELS[status?.subscriptionStatus] || STATUS_LABELS.none;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="container mx-auto max-w-xl">
        <div className="mb-6">
          <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Back to Dashboard</Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-gray-500">Loading…</p>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`font-semibold ${label.color}`}>{label.text}</span>
                </div>

                {status?.periodEnd && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Renews / Expires</span>
                    <span className="text-sm">{new Date(status.periodEnd).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Journeys created</span>
                  <span className="text-sm">{status?.journeyCount ?? '—'} / {status?.isActive ? '∞' : status?.freeLimit}</span>
                </div>

                <div className="pt-4 border-t space-y-3">
                  {status?.isActive ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handlePortal}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Opening portal…' : 'Manage Subscription'}
                    </Button>
                  ) : (
                    <>
                      <div className="text-center mb-4">
                        <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-gray-500">/month</span></p>
                        <p className="text-sm text-gray-500 mt-1">Unlimited journeys · Cancel anytime</p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCheckout}
                        disabled={actionLoading}
                      >
                        {actionLoading ? 'Redirecting…' : 'Subscribe — $29/mo'}
                      </Button>
                    </>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
