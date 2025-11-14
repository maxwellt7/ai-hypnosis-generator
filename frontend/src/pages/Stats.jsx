import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function Stats() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Stats page coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

