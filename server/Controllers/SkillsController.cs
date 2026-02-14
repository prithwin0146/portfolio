using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private static readonly List<Skill> Skills =
    [
        // Frontend — Advanced
        new() { Id = 1, Name = "HTML5", Category = "Frontend", Proficiency = 3 },
        new() { Id = 2, Name = "CSS3 / SCSS", Category = "Frontend", Proficiency = 3 },
        new() { Id = 3, Name = "JavaScript", Category = "Frontend", Proficiency = 3 },
        new() { Id = 4, Name = "TypeScript", Category = "Frontend", Proficiency = 2 },
        new() { Id = 5, Name = "React", Category = "Frontend", Proficiency = 2 },
        new() { Id = 6, Name = "Angular", Category = "Frontend", Proficiency = 2 },
        // Backend — Proficient
        new() { Id = 7, Name = "ASP.NET Core", Category = "Backend", Proficiency = 2 },
        new() { Id = 8, Name = "Node.js", Category = "Backend", Proficiency = 1 },
        new() { Id = 9, Name = "SQL Server", Category = "Backend", Proficiency = 2 },
        new() { Id = 10, Name = "REST APIs", Category = "Backend", Proficiency = 3 },
        // Design
        new() { Id = 11, Name = "Responsive Design", Category = "Design", Proficiency = 3 },
        new() { Id = 12, Name = "UI/UX Principles", Category = "Design", Proficiency = 2 },
        new() { Id = 13, Name = "Figma", Category = "Design", Proficiency = 1 },
        // Tools
        new() { Id = 14, Name = "Git & GitHub", Category = "Tools", Proficiency = 3 },
        new() { Id = 15, Name = "Docker", Category = "Tools", Proficiency = 1 },
        new() { Id = 16, Name = "Vite", Category = "Tools", Proficiency = 2 }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Skill>> GetAll()
    {
        return Ok(Skills);
    }
}
