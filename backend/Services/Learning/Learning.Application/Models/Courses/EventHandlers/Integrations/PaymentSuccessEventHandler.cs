using BuildingBlocks.Messaging.Events.Payments.Sagas;
using MassTransit;

namespace Learning.Application.Models.Courses.EventHandlers.Integrations;
public class PaymentSuccessEventHandler(IUserEnrollmentRepository userEnrollmentRepository) : IConsumer<PaymentSuccessEvent> {
    public async Task Consume(ConsumeContext<PaymentSuccessEvent> context) {
        var message = context.Message;
        if(message.ProductType != "Course") {
            return;
        }
        var userEnrollment = await userEnrollmentRepository.GetByUserIdAndCourseIdAsync(message.UserId, message.ProductId);
        if (userEnrollment != null) {
            return;
        }

        var newUserEnrollment = UserEnrollment.Create(
            UserEnrollmentId.Of(Guid.NewGuid()), UserId.Of(message.UserId),
            CourseId.Of(message.ProductId), DateTime.UtcNow);
        await userEnrollmentRepository.AddAsync(newUserEnrollment);

        await userEnrollmentRepository.SaveChangesAsync();
    }
}

