namespace Learning.Application.Exceptions;
public class TestCaseFailedException : Exception {
    public TestCaseFailedException(string message)
        : base(message) {
    }
}

