import React from 'react';
import { BarChart2, BookOpen, Calendar, Layout, ListChecks, PlusCircle } from 'lucide-react';
import CourseStep from './CourseStep';


const path = {
    pathName: "Full-stack Developer",
    startDate: "2024-03-15",
    endDate: "2025-03-15",
    category: "Web Development",
    difficulty: "Intermediate",
    totalDuration: "12 months",
    reasons: [
      "Strong foundation in both frontend and backend development",
      "High demand in current job market",
      "Matches your previous experience with web technologies",
      "Comprehensive curriculum covering modern web stack"
    ],
    steps: [
      {
        title: "Frontend Fundamentals",
        headline: "Master HTML, CSS, and JavaScript",
        price: 299,
        timeDuration: "3 months",
        description: "Build a strong foundation in modern web development with hands-on projects and real-world applications.",
        topics: [
          "HTML5 Semantic Elements",
          "CSS3 Layouts and Animations",
          "JavaScript ES6+ Features",
          "Responsive Web Design",
          "Web Accessibility"
        ],
        skills: ["HTML", "CSS", "JavaScript", "Git", "Web Standards"]
      },
      {
        title: "React Development",
        headline: "Build modern web applications with React",
        price: 399,
        timeDuration: "4 months",
        description: "Learn to build scalable applications using React and its ecosystem of tools and libraries.",
        topics: [
          "React Fundamentals",
          "State Management",
          "Hooks and Custom Hooks",
          "React Router",
          "Performance Optimization"
        ],
        skills: ["React", "Redux", "TypeScript", "Testing", "Performance"]
      },
      {
        title: "Backend Development",
        headline: "Master Node.js and Express",
        price: 449,
        timeDuration: "5 months",
        description: "Develop secure and scalable backend services using Node.js and modern backend technologies.",
        topics: [
          "Node.js Fundamentals",
          "Express Framework",
          "Database Design",
          "API Development",
          "Authentication & Security"
        ],
        skills: ["Node.js", "Express", "MongoDB", "REST APIs", "Security"]
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80"
  };


export function RoadmapDashboard() {

  return (
    <div className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Lộ trình được đề xuất</h2>
        <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Tạo lộ trình
        </button>
      </div>

      <div className="bg-white rounded-xl overflow-hidden shadow-lg">
      <img
        src={path.imageUrl}
        alt={path.pathName}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">{path.pathName}</h3>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {new Date(path.startDate).toLocaleDateString()} - {new Date(path.endDate).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Layout size={16} />
              {path.category}
            </span>
            <span className="flex items-center gap-1">
              <BarChart2 size={16} />
              {path.difficulty}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen size={16} />
              {path.totalDuration}
            </span>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ListChecks size={18} className="text-red-500" />
            Lý do đề xuất
          </h4>
          <ul className="space-y-2">
            {path.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2 text-gray-600">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Các bước trong lộ trình</h4>
          {path.steps.map((step, index) => (
            <CourseStep key={index} step={step} index={index} />
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}