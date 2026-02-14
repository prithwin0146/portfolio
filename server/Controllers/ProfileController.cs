using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    [HttpGet]
    public ActionResult<Profile> Get()
    {
        // TODO: Replace with your real data or a data store
        var profile = new Profile
        {
            Name = "Prithwin M",
            Title = "Freelance Web Designer & Developer",
            Bio = "I design and build modern websites that help businesses stand out online — from landing pages to full-stack web apps. Let's bring your vision to life.",
            Email = "Prithwin0146@gmail.com",
            GitHubUrl = "https://github.com/prithwin0146",
            LinkedInUrl = "https://www.linkedin.com/in/prithwin-m",
            AvatarUrl = ""
        };

        return Ok(profile);
    }
}
