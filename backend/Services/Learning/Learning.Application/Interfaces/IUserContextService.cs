namespace Learning.Application.Interfaces;
public interface IUserContextService {
    IUserContext User { get; }
}
public interface IUserContext {
    Guid? Id { get; }
    string UserName { get; }
}

