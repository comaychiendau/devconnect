using System.ComponentModel.DataAnnotations;

namespace DevConnect.Api.Contracts.Auth;

public sealed class LoginRequest
{
    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; init; } = string.Empty;
    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;

    public bool RememberMe { get; init; }
}
