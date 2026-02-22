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
            Title = "JobBuddy — Workforce Solutions Platform",
            Description = "Built a full-scale workforce solutions platform for a consultancy serving employers across Tamil Nadu. Features include SSR-powered Angular frontend for SEO, employer/candidate enquiry flows, blog with rich content, multi-page architecture (workforce solutions, about, contact, courses), and a .NET backend with structured hiring pipeline. Live in production serving real clients across manufacturing, logistics, BPO, and healthcare industries.",
            ImageUrl = "/projects/jobbuddy.png",
            LiveUrl = "https://www.thejobbuddy.in",
            GitHubUrl = "https://github.com/prithwin0146/jobbuddy",
            Tags = ["Angular", "TypeScript", "ASP.NET Core", "SSR", "SEO", "SQL Server"]
        },
        new()
        {
            Id = 2,
            Title = "Employee Management System",
            Description = "Internal workforce management dashboard with role-based access control across 3 user tiers (Admin, Manager, Employee). Features server-side pagination handling 500+ records, real-time search with CTE-optimized SQL queries, sorting/filtering across all columns, and a clean Angular Material UI. Built with a layered .NET architecture for maintainability.",
            ImageUrl = "/projects/ems.png",
            LiveUrl = "",
            GitHubUrl = "https://github.com/prithwin0146/Demo",
            Tags = ["Angular", "TypeScript", "ASP.NET Core", "SQL Server", "RBAC", "Angular Material"]
        },
        new()
        {
            Id = 3,
            Title = "JK Travels — Travel Agency Website",
            Description = "Designed and built a responsive travel agency website for a local Ooty-based business. Features travel package showcases with pricing, WhatsApp-integrated enquiry form that opens a pre-filled chat, testimonials section, smooth scroll animations, and a mobile-first design. Deployed on Vercel with 95+ Lighthouse performance score.",
            ImageUrl = "/projects/jk-travels.png",
            LiveUrl = "https://jk-travels-website.vercel.app",
            GitHubUrl = "https://github.com/prithwin0146/JK-Travels-website",
            Tags = ["React", "JavaScript", "Vite", "CSS", "Vercel"]
        },
        new()
        {
            Id = 4,
            Title = "Steam Portfolio — Developer Portfolio",
            Description = "The site you're on right now! A Steam-inspired developer portfolio featuring an XP & leveling system, achievement showcase, Konami code easter egg, command palette (⌘K), real-time GitHub activity feed, smooth scroll animations, 6 language modes, and a .NET backend API. Built with performance and personality in mind.",
            ImageUrl = "/projects/portfolio.png",
            LiveUrl = "https://prithwin.dev",
            GitHubUrl = "https://github.com/prithwin0146/Sprkey",
            Tags = ["React", "TypeScript", "Vite", ".NET 8", "CSS Modules", "Vercel", "Railway"]
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
