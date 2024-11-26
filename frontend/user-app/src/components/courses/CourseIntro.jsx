import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function CourseIntro() {
  const learningPoints = [
    'Certification that validates practical knowledge of Kubernetes.',
    'How to initialize and deploy a Kubernetes project on the Cloud.',
    'Real-world project deployment and operation methods on Kubernetes.',
    'Deep understanding of Kubernetes architecture and components.',
    'Hands-on experience with container orchestration.',
    'Best practices for scaling and managing applications.'
  ];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-primary-text mb-4">What Will You Learn?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {learningPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary-text mt-1 flex-shrink-0" />
              <span className="text-primary-muted">{point}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}