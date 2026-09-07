using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace DevConnect.Api.Models;

public class ApplicationUser : IdentityUser
{
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;
}