using Newtonsoft.Json;

namespace AI.Infrastructure.Services.Kernels;
public sealed class FunctionInvocationFilter : IFunctionInvocationFilter {
    public async Task OnFunctionInvocationAsync(FunctionInvocationContext context, Func<FunctionInvocationContext, Task> next) {

        Console.WriteLine(($"{context.Function.Name}:{JsonConvert.SerializeObject(context.Arguments)}\n"));
        await next(context);
    }
}



