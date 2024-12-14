import React from 'react';
import { Calendar, BarChart2, ListChecks, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import CourseStep from './CourseStep';



export const LearningPathCard = ({
  path,
  courseDetails,
  onEdit,
  onDelete,
}) => {

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg mb-6">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">{path.pathName}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {format(new Date(path.startDate), 'MM/dd/yyyy')} - {format(new Date(path.endDate), 'MM/dd/yyyy')}
              </span>
              <span className="flex items-center gap-1">
                <BarChart2 size={16} />
                {path.status}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(path)}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              title="Edit path"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={() => onDelete(path.id)}
              className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              title="Delete path"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ListChecks size={18} className="text-red-500" />
            Reasons
          </h4>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-gray-600">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
              {path.reason}
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Steps in the roadmap</h4>
          {path.pathSteps
            .sort((a, b) => a.stepOrder - b.stepOrder)
            .map((step, index) => (
              <CourseStep
                key={step.id}
                step={step}
                index={index}
                course={courseDetails[step.courseId]}
              />
            ))}
        </div>
      </div>
    </div>
  );
};