using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServicesController : ControllerBase
{
    private static readonly List<Service> Services =
    [
        new()
        {
            Id = 1,
            Name = "Custom Website Design",
            Tagline = "From Concept to Launch",
            Description = "I design and build stunning, responsive websites tailored to your brand — whether it's a business site, portfolio, or landing page.",
            Icon = "🎨",
            Deliverables =
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
            Name = "Full-Stack Web Applications",
            Tagline = "End-to-End Development",
            Description = "Need more than a static site? I build powerful web applications with secure backends, databases, and admin dashboards.",
            Icon = "⚡",
            Deliverables =
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
            Name = "Website Redesign & Optimization",
            Tagline = "Refresh Your Online Presence",
            Description = "Already have a website that looks outdated or loads slow? I'll redesign it with a modern look and optimize performance.",
            Icon = "🔧",
            Deliverables =
            [
                "Complete visual redesign",
                "Performance & speed optimization",
                "Mobile responsiveness fixes",
                "SEO audit & improvements"
            ]
        }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Service>> GetAll() => Ok(Services);
}
