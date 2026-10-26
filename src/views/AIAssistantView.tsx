import React from 'react';
import { AIAssistantDrawer } from '../components/AIAssistantDrawer';

export const AIAssistantView: React.FC = () => {
  return (
    <div className="h-[calc(100vh-8.5rem)] pb-4">
      <AIAssistantDrawer isOpen={true} onClose={() => {}} isFullPage={true} />
    </div>
  );
};
