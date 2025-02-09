import React from 'react';
import Timeline from './components/Timeline';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-white mb-4">Video Timeline Editor</h1>
        <div className="h-[600px] bg-gray-800 rounded-lg overflow-hidden">
          <Timeline />
        </div>
      </div>
    </div>
  );
}

export default App;