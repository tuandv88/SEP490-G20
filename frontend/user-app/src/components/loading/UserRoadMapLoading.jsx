export default function UserRoadMapLoading() {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-6">
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-4 items-center">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
  
        {/* Reasons Section */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
        </div>
  
        {/* Course Modules Section */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          
          {/* Course Items */}
          {[1, 2, 3].map((item) => (
            <div 
              key={item}
              className="p-6 border border-gray-100 rounded-lg space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse flex-shrink-0" />
                <div className="space-y-3 w-full">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-4">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  