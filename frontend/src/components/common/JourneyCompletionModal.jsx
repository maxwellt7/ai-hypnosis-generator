import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Sparkles, ArrowRight, X } from 'lucide-react';

export default function JourneyCompletionModal({ journey, onClose }) {
  const navigate = useNavigate();

  const handleStartNext = () => {
    onClose();
    navigate(`/create-journey?from_journey=${journey.id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <Card className="w-full max-w-lg relative overflow-hidden">
        {/* Gradient accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <CardHeader className="pt-8 pb-2 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Journey Complete!</CardTitle>
          <p className="text-gray-500 text-sm mt-1">
            7 days of consistent practice. That&apos;s transformation.
          </p>
        </CardHeader>

        <CardContent className="space-y-5 pb-6">
          <div className="rounded-lg bg-purple-50 border border-purple-100 px-4 py-3 text-sm text-purple-800">
            <p className="font-medium mb-1">Your journey:</p>
            <p className="italic text-purple-700 line-clamp-2">&ldquo;{journey.goal}&rdquo;</p>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="font-medium text-gray-700">Three reflection questions to sit with:</p>
            <ul className="space-y-1.5 list-none">
              <li className="flex gap-2">
                <span className="text-purple-400 mt-0.5">▸</span>
                What subtle shifts did you notice in yourself this week?
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 mt-0.5">▸</span>
                Which session stayed with you the most, and why?
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400 mt-0.5">▸</span>
                What would you like to deepen or explore next?
              </li>
            </ul>
          </div>

          <div className="pt-1 space-y-2">
            <Button
              className="w-full"
              variant="gradient"
              onClick={handleStartNext}
            >
              Start Your Next Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <button
              className="w-full text-sm text-gray-400 hover:text-gray-600 py-1"
              onClick={onClose}
            >
              Stay here for now
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
