using BuildingBlocks.Messaging.Events.Payments.Sagas;
using BuildingBlocks.Messaging.Events.Payments.Sagas.Commands;
using MassTransit;

namespace Learning.Application.Models.Courses.EventHandlers.Integrations;
public class ValidateProductCommandHandler(ICourseRepository courseRepository, IUserEnrollmentRepository userEnrollmentRepository, IPublishEndpoint publishEndpoint) : IConsumer<ValidateProductCommand> {
    public async Task Consume(ConsumeContext<ValidateProductCommand> context) {
        var message = context.Message;
        if(message.ProductType == "Course") {
            var course = await courseRepository.GetByIdAsync(message.ProductId);
            var userEnrollMent = await userEnrollmentRepository.GetByUserIdAndCourseIdAsync(message.UserId, message.ProductId);
            if (course == null || course.Price != message.UnitPrice || userEnrollMent!= null) {
                await PublishProductValidationEventFail(message.TransactionId);
                return;
            }
            await publishEndpoint.Publish(new ProductValidationEvent() {
                TransactionId = message.TransactionId,
                IsValid = true,
                ProductName = course.Title,
                ProductDescription = course.Description
            });
        } else {
            await PublishProductValidationEventFail(message.TransactionId);
        }
        await courseRepository.SaveChangesAsync();
    }

    private async Task PublishProductValidationEventFail(Guid transactionId) {
        await publishEndpoint.Publish(new ProductValidationEvent() {
            TransactionId = transactionId,
            IsValid = false
        });
    }
}

