namespace AI.Application.Interfaces;
public interface IUserContextService {
    IUserContext User { get; }
}
public interface IUserContext {
    Guid Id { get; }
    string UserName { get; }
    string Email { get; }
    string FirstName { get; }
    string LastName { get; }
    string Role { get; }
}
