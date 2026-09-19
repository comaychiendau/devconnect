namespace DevConnect.Api.Models;

public class Community
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    // Temporarily nullable so existing communities remain valid.
    public string? CreatedByUserId { get; set; }
}