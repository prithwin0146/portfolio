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
            ImageUrl = "/projects/yuji.png",
            LiveUrl = "https://www.thejobbuddy.in",
            GitHubUrl = "https://github.com/prithwin0146/jobbuddy",
            Tags = ["Angular", "TypeScript", "ASP.NET Core", "SSR", "SEO", "SQL Server"]
        },
        new()
        {
            Id = 2,
            Title = "SeeThePrep — Live Kitchen Transparency",
            Description = "The UK's first food delivery platform providing live kitchen transparency. Allows users to order food online and watch their meals being cooked in real-time on camera from FSA 5-star verified restaurants with full allergen disclosure.",
            ImageUrl = "/projects/sukuna.png",
            LiveUrl = "https://seetheprep.com/",
            GitHubUrl = "https://github.com/prithwin0146/FoodPlatform",
            Tags = ["Angular", "TypeScript", "Material Design", "Live Streaming"]
        },
        new()
        {
            Id = 3,
            Title = "ELPN — Spoken English Classes",
            Description = "A high-conversion landing page for an English language coaching network with over 17 years of experience and 10,000+ students trained. Features optimized enrollment flows and fast load times.",
            ImageUrl = "/projects/hakari.png",
            LiveUrl = "https://espn-swart.vercel.app/",
            GitHubUrl = "https://github.com/prithwin0146/ESPN",
            Tags = ["React", "Next.js", "Tailwind CSS", "Vercel"]
        },
        new()
        {
            Id = 4,
            Title = "Tutor Me — Personalized Academic Support",
            Description = "A modern educational platform for personal tutoring in Coimbatore offering academic support, test preparation, and future-ready skills. Supports multiple modalities including at-home, in-center, and online sessions.",
            ImageUrl = "/projects/yuta.png",
            LiveUrl = "https://tutorme-ochre.vercel.app/",
            GitHubUrl = "https://github.com/prithwin0146/TutorMe",
            Tags = ["React", "Next.js", "Tailwind CSS", "Vercel"]
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
