using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;
using Portfolio.Api.Services;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ILogger<ContactController> _logger;
    private readonly ContactStore _store;

    public ContactController(ILogger<ContactController> logger, ContactStore store)
    {
        _logger = logger;
        _store = store;
    }

    [HttpPost]
    public async Task<ActionResult> Post([FromBody] ContactMessage message)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            await _store.SaveAsync(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save contact message");
            return StatusCode(500, new { success = false, message = "Something went wrong. Please try again." });
        }

        return Ok(new { success = true, message = "Thank you! Your message has been received." });
    }

    /// <summary>
    /// Admin endpoint — list all stored messages.
    /// In production, protect this with auth.
    /// </summary>
    [HttpGet]
    public async Task<ActionResult> GetAll()
    {
        var messages = await _store.GetAllAsync();
        return Ok(messages);
    }
}
