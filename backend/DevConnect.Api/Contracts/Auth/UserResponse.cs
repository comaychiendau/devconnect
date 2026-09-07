namespace DevConnect.Api.Contracts.Auth;

public sealed class UserResponse
{
    public string Id { get; init; } = string.Empty;

    public string UserName { get; init; } = string.Empty;

    public string Email { get; init; } = string.Empty;

    public string FullName { get; init; } = string.Empty;
}