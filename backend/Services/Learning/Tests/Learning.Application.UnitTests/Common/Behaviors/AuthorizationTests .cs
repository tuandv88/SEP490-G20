using FluentAssertions;
using Learning.Application.Commons;
using Learning.Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Moq;
using System.Security.Claims;

namespace Learning.Application.UnitTests.Common.Behaviors;

[TestFixture]
public class AuthorizationTests {
    private Mock<IHttpContextAccessor> _httpContextAccessorMock;
    private Mock<IIdentityService> _identityServiceMock;
    private AuthorizationBehavior<TestRequest, TestResponse> _behavior;

    [SetUp]
    public void Setup() {
        _httpContextAccessorMock = new Mock<IHttpContextAccessor>();
        _identityServiceMock = new Mock<IIdentityService>();
        _behavior = new AuthorizationBehavior<TestRequest, TestResponse>(
            _httpContextAccessorMock.Object, _identityServiceMock.Object);
    }

    [Test]
    public async Task Handle_ShouldSkipAuthorization_WhenHttpContextIsNull() {
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns((HttpContext?)null);
        var request = new TestRequest();
        var next = new RequestHandlerDelegate<TestResponse>(() => Task.FromResult(new TestResponse()));

        var response = await _behavior.Handle(request, next, CancellationToken.None);

        response.Should().NotBeNull();
    }

    [Test]
    public void Handle_ShouldThrowUnauthorizedAccessException_WhenNoUserClaims() {
        var context = new DefaultHttpContext();
        context.User = new ClaimsPrincipal();
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);
        var request = new TestRequest();
        var next = new RequestHandlerDelegate<TestResponse>(() => Task.FromResult(new TestResponse()));

        Func<Task> act = async () => await _behavior.Handle(request, next, CancellationToken.None);

        act.Should().ThrowAsync<UnauthorizedAccessException>();
    }

    [Test]
    public async Task Handle_ShouldThrowUnauthorizedAccessException_WhenUserDoesNotMeetPolicy() {
        var context = new DefaultHttpContext();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("type", "value") }));
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

        var behavior = new AuthorizationBehavior<TestRequestWithPolicy, TestResponse>(
            _httpContextAccessorMock.Object, _identityServiceMock.Object);

        var request = new TestRequestWithPolicy();
        var next = new RequestHandlerDelegate<TestResponse>(() => Task.FromResult(new TestResponse()));

        _identityServiceMock
            .Setup(x => x.AuthorizePolicyAsync(It.IsAny<string[]>()))
            .Returns(false);

        Func<Task> act = async () => await behavior.Handle(request, next, CancellationToken.None);

        await act.Should().ThrowAsync<UnauthorizedAccessException>().WithMessage("User does not meet policy requirements.");
    }

    [Test]
    public async Task Handle_ShouldCallNext_WhenAuthorizationIsSuccessful() {
        var context = new DefaultHttpContext();
        context.User = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("role", "admin") }));
        _httpContextAccessorMock.Setup(x => x.HttpContext).Returns(context);

        var behavior = new AuthorizationBehavior<TestRequestWithPolicy, TestResponse>(
            _httpContextAccessorMock.Object, _identityServiceMock.Object);

        var request = new TestRequestWithPolicy();
        var next = new RequestHandlerDelegate<TestResponse>(() => Task.FromResult(new TestResponse()));

        _identityServiceMock
            .Setup(x => x.AuthorizePolicyAsync(It.IsAny<string[]>()))
            .Returns(true);

        var response = await behavior.Handle(request, next, CancellationToken.None);

        response.Should().NotBeNull();
    }


    public class TestRequest { }

    [Authorize(PoliciesType.Administrator)]
    public class TestRequestWithPolicy { }

    public class TestResponse { }
}
