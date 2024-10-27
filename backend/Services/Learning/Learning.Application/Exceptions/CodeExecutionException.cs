namespace Learning.Application.Exceptions;
public class CodeExecutionException : Exception {
    public CodeExecutionException() : base("An error occurred during code execution.") {
    }

    public CodeExecutionException(string message) : base(message) {
    }

    public CodeExecutionException(string message, Exception innerException) : base(message, innerException) {
    }
}
