using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExperienceController : ControllerBase
{
    private static readonly List<Experience> Experiences =
    [
        new()
        {
            Id = 1,
            Company = "Custom Website Design",
            Role = "From Concept to Launch",
            Description = "I design and build stunning, responsive websites tailored to your brand — whether it's a business site, portfolio, or landing page.",
            StartDate = "What You Get",
            EndDate = null,
            Highlights =
            [
                "Fully responsive, mobile-first design",
                "Modern UI/UX with smooth animations",
                "SEO-optimized & fast-loading pages",
                "Custom CMS or admin panel if needed"
            ]
        },
        new()
        {
            Id = 2,
            Company = "Full-Stack Web Applications",
            Role = "End-to-End Development",
            Description = "Need more than a static site? I build powerful web applications with secure backends, databases, and admin dashboards.",
            StartDate = "What You Get",
            EndDate = null,
            Highlights =
            [
                "React / Angular frontend development",
                "ASP.NET Core / Node.js backend APIs",
                "Database design (SQL Server, MongoDB)",
                "Authentication, dashboards & analytics"
            ]
        },
        new()
        {
            Id = 3,
            Company = "Website Redesign & Optimization",
            Role = "Refresh Your Online Presence",
            Description = "Already have a website that looks outdated or loads slow? I'll redesign it with a modern look and optimize performance.",
            StartDate = "What You Get",
            EndDate = null,
            Highlights =
            [
                "Complete visual redesign",
                "Performance & speed optimization",
                "Mobile responsiveness fixes",
                "SEO audit & improvements"
            ]
        }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Experience>> GetAll()
    {
        return Ok(Experiences);
    }
}
