using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ILogger<ContactController> _logger;

    public ContactController(ILogger<ContactController> logger)
    {
        _logger = logger;
    }

    [HttpPost]
    public ActionResult Post([FromBody] ContactMessage message)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // TODO: Wire up email service or persist to database
        _logger.LogInformation(
            "Contact form submitted by {Name} ({Email}): {Subject}",
            message.Name,
            message.Email,
            message.Subject
        );

        return Ok(new { success = true, message = "Thank you! Your message has been received." });
    }
}
