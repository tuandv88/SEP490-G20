using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace User.Infrastructure.Data.Repositories.PathSteps
{
    public  class PathStepsRepository : Repository<PathStep>, IPathStepsRepository
    {
        private readonly IApplicationDbContext _dbContext;
        public PathStepsRepository(IApplicationDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
        }
        public override async Task<PathStep> GetByIdAsync(Guid id)
        {
            // Triển khai logic để lấy LearningPath theo Id từ database
            var PathStep = await _dbContext.PathSteps.FindAsync(id);
            if (PathStep == null)
            {
                throw new KeyNotFoundException($"LearningPath với id '{id}' không được tìm thấy.");
            }
            return PathStep;
        }

        public override async Task DeleteByIdAsync(Guid id)
        {
            var PathStep = await GetByIdAsync(id); // Sử dụng phương thức GetByIdAsync
            if (PathStep == null)
            {
                throw new KeyNotFoundException($"LearningPath với id '{id}' không được tìm thấy.");
            }
            
            _dbContext.PathSteps.Remove(PathStep);
        }

        public async Task<List<PathStep>> GetByLearningPathIDAsync(Guid LearningPathId)
        {
            // Lọc các PathStep theo LearningPathId
            var pathSteps = await _dbContext.PathSteps
                .Where(lp => lp.LearningPathId.Equals(new LearningPathId(LearningPathId)))
                .ToListAsync();  // Lấy tất cả các PathStep phù hợp và chuyển đổi thành danh sách

            return pathSteps;  // Trả về danh sách các PathStep
        }

        public async Task<PathStep> GetByPathStepIdAsync(Guid pathStepId)
        {
            // Chuyển đổi Guid thành PathStepId trước khi thực hiện truy vấn
           
            var pathStepIdObject = PathStepId.Of(pathStepId);

            // Truy vấn để lấy PathStep bằng PathStepId đã chuyển đổi
            var pathStep = await _dbContext.PathSteps
                .FirstOrDefaultAsync(ps => ps.Id == pathStepIdObject); // So sánh với PathStepId dưới dạng ValueObject

            if (pathStep == null)
            {
                throw new KeyNotFoundException($"PathStep với PathStepId '{pathStepId}' không được tìm thấy.");
            }

            return pathStep;
        }
        public async Task<int?> GetMaxStepOrderByLearningPathIdAsync(Guid learningPathId)
        {
            var learningPathObject = LearningPathId.Of(learningPathId);
            // Truy vấn lấy StepOrder lớn nhất cho LearningPathId cụ thể
            var maxStepOrder = await _dbContext.PathSteps
                .Where(ps => ps.LearningPathId == learningPathObject)  // Lọc theo LearningPathId
                .MaxAsync(ps => (int?)ps.StepOrder) ?? 0;  // Dùng MaxAsync để lấy giá trị StepOrder lớn nhất, chuyển đổi về kiểu nullable int

            return maxStepOrder;  // Trả về giá trị MaxStepOrder, có thể là null nếu không có bản ghi nào phù hợp
        }

        public async Task<PathStep> GetByLearningPathAndCourseIdAsync(Guid learningPathId, Guid courseId)
        {
            var learningPathObject = LearningPathId.Of(learningPathId);
            var courseidObject = CourseId.Of(courseId);
            // Truy vấn để tìm PathStep với LearningPathId và CourseId
            return await _dbContext.PathSteps
                .FirstOrDefaultAsync(ps => ps.LearningPathId == learningPathObject && ps.CourseId == courseidObject);
        }
    }
}
