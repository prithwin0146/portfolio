using System.Text.Json;
using Portfolio.Api.Models;

namespace Portfolio.Api.Services;

/// <summary>
/// Persists contact-form messages to a local JSON file.
/// In production you'd swap this for a database or email service,
/// but this ensures no message is ever silently dropped.
/// </summary>
public class ContactStore
{
    private readonly string _filePath;
    private readonly ILogger<ContactStore> _logger;
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public ContactStore(ILogger<ContactStore> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        var dataDir = Path.Combine(env.ContentRootPath, "App_Data");
        Directory.CreateDirectory(dataDir);
        _filePath = Path.Combine(dataDir, "messages.json");
    }

    public async Task SaveAsync(ContactMessage message)
    {
        await _lock.WaitAsync();
        try
        {
            var entries = new List<ContactEntry>();

            if (File.Exists(_filePath))
            {
                var json = await File.ReadAllTextAsync(_filePath);
                entries = JsonSerializer.Deserialize<List<ContactEntry>>(json) ?? [];
            }

            entries.Add(new ContactEntry
            {
                Id = Guid.NewGuid().ToString("N"),
                Name = message.Name,
                Email = message.Email,
                Subject = message.Subject,
                Message = message.Message,
                ReceivedAt = DateTime.UtcNow
            });

            var options = new JsonSerializerOptions { WriteIndented = true };
            await File.WriteAllTextAsync(_filePath, JsonSerializer.Serialize(entries, options));

            _logger.LogInformation("Contact message saved from {Name} ({Email})", message.Name, message.Email);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to persist contact message");
            throw;
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task<List<ContactEntry>> GetAllAsync()
    {
        if (!File.Exists(_filePath)) return [];

        var json = await File.ReadAllTextAsync(_filePath);
        return JsonSerializer.Deserialize<List<ContactEntry>>(json) ?? [];
    }
}

public class ContactEntry
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public DateTime ReceivedAt { get; set; }
}
