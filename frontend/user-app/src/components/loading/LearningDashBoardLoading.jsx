export default function LearningDashBoardLoading() {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Your Courses */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
  
          {/* In Progress */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
  
          {/* Completed */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg animate-pulse" />
              <div className="space-y-2">
                <div className="h-7 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
  
        {/* Section Title */}
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
  
        {/* Course Cards */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex gap-6">
                {/* Course Image */}
                <div className="w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />
                
                {/* Course Content */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-2 w-full bg-gray-100 rounded">
                    <div className="h-2 w-1/3 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  {/* Button */}
                  <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  