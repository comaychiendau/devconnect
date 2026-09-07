using System.ComponentModel.DataAnnotations;

namespace DevConnect.Api.Contracts.Auth;
public sealed class RegisterRequest
{
    [Required]
    [MaxLength(150)]
    public string FullName { get; init; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(256)]
    public string Email { get; init; } = string.Empty;

    [Required]
    [MinLength(3)]
    [MaxLength(30)]
    [RegularExpression(
    @"^[a-zA-Z0-9._-]+$",
    ErrorMessage = "Username can only contain letters, numbers, dots, underscores and hyphens.")]
    public string UserName { get; init; } = string.Empty;

    [Required]
    [MinLength(8)]
    public string Password { get; init; } = string.Empty;
}
