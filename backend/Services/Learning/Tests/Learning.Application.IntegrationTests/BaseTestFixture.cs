using static Learning.Application.IntegrationTests.Testing;
namespace Learning.Application.IntegrationTests;
[TestFixture]
public abstract class BaseTestFixture {
    [SetUp]
    public async Task TestSetUp() {
        await ResetState();
    }
}

