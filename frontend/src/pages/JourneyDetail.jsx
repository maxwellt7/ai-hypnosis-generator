import { useParams } from 'react-router-dom';

export default function JourneyDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card">
          <h2 className="text-3xl font-bold mb-6">Journey Details</h2>
          <p className="text-gray-600">
            Journey ID: {id}
          </p>
          <p className="text-gray-600 mt-4">
            This is a placeholder. In the full version, this will show the 7-day journey timeline with audio players.
          </p>
        </div>
      </div>
    </div>
  );
}

