import React from 'react';
import { Clock, Calendar, Award } from 'lucide-react';

export function CourseSidebar() {
  return (
    <div className="space-y-6">
      {/* Free Course Card */}
      <div className="bg-primary-light rounded-lg p-6 border border-primary-dark">
        <h3 className="text-xl font-semibold mb-4 text-primary-text">Free of charge</h3>
        <button className="w-full bg-primary-dark text-primary-text py-3 rounded-lg font-semibold hover:bg-primary transition-colors mb-4">
          Sign up now
        </button>
        <p className="text-center text-primary-muted text-sm">Join the course for free</p>
      </div>

      {/* Course Details Card */}
      <div className="bg-primary-light rounded-lg p-6 border border-primary-dark space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-primary-muted">All levels</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-text" />
          <span className="text-primary-muted">9 hours 32 minutes Duration</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-text" />
          <span className="text-primary-muted">November 11, 2024 Last Updated</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary-text" />
          <span className="text-primary-muted">Certificate of Completion</span>
        </div>
      </div>

      {/* Course By Card */}
      <div className="bg-primary-light rounded-lg p-6 border border-primary-dark">
        <h3 className="text-lg font-semibold mb-4 text-primary-text">Course by</h3>
        
        {/* Instructor */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-primary-dark rounded-full flex items-center justify-center text-primary-text font-bold">
            EL
          </div>
          <div>
            <h4 className="font-medium text-primary-text">elroydevops</h4>
            <p className="text-sm text-primary-muted">DevOps Engineer</p>
          </div>
        </div>

        {/* Organization */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-dark rounded-full flex items-center justify-center text-primary-text font-bold">
            D
          </div>
          <div>
            <h4 className="font-medium text-primary-text">devopsedu.vn</h4>
          </div>
        </div>
      </div>

      {/* Course Materials Card */}
      <div className="bg-primary-light rounded-lg p-6 border border-primary-dark">
        <h3 className="text-lg font-semibold mb-4 text-primary-text">Course materials</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-primary-muted">Support group:</span>
            <a href="https://fb.com/groups/950551346787852" className="text-primary-text hover:text-primary-muted break-all transition-colors">
              https://fb.com/groups/950551346787852
            </a>
          </div>
        </div>
      </div>

      {/* Object Card */}
      <div className="bg-primary-light rounded-lg p-6 border border-primary-dark">
        <h3 className="text-lg font-semibold mb-4 text-primary-text">Object</h3>
        <ul className="space-y-4 text-primary-muted">
          <li className="flex items-start gap-2">
            <span className="text-primary-text font-bold">•</span>
            <p>You want to become a DevOps Engineer but don't know where to start? You don't have any practical DevOps knowledge?</p>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-text font-bold">•</span>
            <p>Are you a Developer, Sysadmin, Tester, DBA,... wanting to gain more DevOps knowledge to increase your income and stand out from other candidates?</p>
          </li>
        </ul>
      </div>
    </div>
  );
}