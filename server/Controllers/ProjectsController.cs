using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private static readonly List<Project> Projects =
    [
        new()
        {
            Id = 1,
            Title = "JobBuddy — Workforce Platform",
            Description = "Built a production workforce platform handling 1500+ deployments. Implemented SSR for 40% faster load times, employer/candidate enquiry system, admin dashboard with analytics, and an SEO-optimized blog.",
            ImageUrl = "",
            LiveUrl = "https://www.thejobbuddy.in",
            GitHubUrl = "https://github.com/prithwin0146/jobbuddy",
            Tags = ["Angular", "TypeScript", "ASP.NET Core", "SQL Server", "SSR"]
        },
        new()
        {
            Id = 2,
            Title = "Employee Management Dashboard",
            Description = "Developed an internal management tool with RBAC across 3 user roles, server-side pagination handling 500+ records, real-time search, and a polished Angular Material UI.",
            ImageUrl = "",
            LiveUrl = "#",
            GitHubUrl = "https://github.com/prithwin0146/Demo",
            Tags = ["Angular", "TypeScript", "ASP.NET Core", "SQL Server", "Angular Material"]
        },
        new()
        {
            Id = 3,
            Title = "JK Travels — Travel Agency Site",
            Description = "Designed a responsive travel site scoring 95+ on Lighthouse performance. Features travel packages showcase, WhatsApp-integrated contact form with instant enquiry flow, and smooth scroll animations.",
            ImageUrl = "",
            LiveUrl = "#",
            GitHubUrl = "https://github.com/prithwin0146/JK-Travels-website",
            Tags = ["React", "JavaScript", "Vite", "CSS"]
        }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Project>> GetAll()
    {
        return Ok(Projects);
    }

    [HttpGet("{id}")]
    public ActionResult<Project> GetById(int id)
    {
        var project = Projects.FirstOrDefault(p => p.Id == id);
        return project is null ? NotFound() : Ok(project);
    }
}
