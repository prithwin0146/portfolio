using Microsoft.AspNetCore.Mvc;
using Portfolio.Api.Models;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SkillsController : ControllerBase
{
    private static readonly List<Skill> Skills =
    [
        // Languages & Frameworks
        new() { Id = 1,  Name = "C#",                        Category = "Languages & Frameworks", Proficiency = 3 },
        new() { Id = 2,  Name = ".NET Framework / .NET 8",   Category = "Languages & Frameworks", Proficiency = 3 },
        new() { Id = 3,  Name = "ASP.NET MVC",               Category = "Languages & Frameworks", Proficiency = 3 },
        new() { Id = 4,  Name = "Web Forms",                 Category = "Languages & Frameworks", Proficiency = 2 },
        new() { Id = 5,  Name = "Entity Framework",          Category = "Languages & Frameworks", Proficiency = 3 },
        new() { Id = 6,  Name = "LINQ",                      Category = "Languages & Frameworks", Proficiency = 3 },
        new() { Id = 7,  Name = "ADO.NET",                   Category = "Languages & Frameworks", Proficiency = 2 },
        new() { Id = 8,  Name = "Python",                    Category = "Languages & Frameworks", Proficiency = 2 },
        new() { Id = 9,  Name = "JavaScript (ES6+)",         Category = "Languages & Frameworks", Proficiency = 3 },
        new() { Id = 10, Name = "TypeScript",                Category = "Languages & Frameworks", Proficiency = 3 },

        // Front-end & UI
        new() { Id = 11, Name = "HTML5",                     Category = "Front-end & UI", Proficiency = 3 },
        new() { Id = 12, Name = "CSS3",                      Category = "Front-end & UI", Proficiency = 3 },
        new() { Id = 13, Name = "Tailwind CSS",              Category = "Front-end & UI", Proficiency = 2 },
        new() { Id = 14, Name = "Bootstrap 5",               Category = "Front-end & UI", Proficiency = 3 },
        new() { Id = 15, Name = "React",                     Category = "Front-end & UI", Proficiency = 3 },
        new() { Id = 16, Name = "Blazor",                    Category = "Front-end & UI", Proficiency = 2 },
        new() { Id = 17, Name = "Three.js",                  Category = "Front-end & UI", Proficiency = 1 },
        new() { Id = 18, Name = "React Three Fiber",         Category = "Front-end & UI", Proficiency = 1 },
        new() { Id = 19, Name = "Framer Motion",             Category = "Front-end & UI", Proficiency = 2 },

        // Database
        new() { Id = 20, Name = "MS SQL Server",             Category = "Database", Proficiency = 3 },
        new() { Id = 21, Name = "Supabase",                  Category = "Database", Proficiency = 2 },
        new() { Id = 22, Name = "Firebase",                  Category = "Database", Proficiency = 1 },

        // Tools & Platforms
        new() { Id = 23, Name = "Visual Studio",             Category = "Tools & Platforms", Proficiency = 3 },
        new() { Id = 24, Name = "VS Code",                   Category = "Tools & Platforms", Proficiency = 3 },
        new() { Id = 25, Name = "Git",                       Category = "Tools & Platforms", Proficiency = 3 },
        new() { Id = 26, Name = "Azure DevOps",              Category = "Tools & Platforms", Proficiency = 2 },
        new() { Id = 27, Name = "SQL Server Management Studio", Category = "Tools & Platforms", Proficiency = 3 },
        new() { Id = 28, Name = "IIS",                       Category = "Tools & Platforms", Proficiency = 2 },
        new() { Id = 29, Name = "Vercel",                    Category = "Tools & Platforms", Proficiency = 2 },
        new() { Id = 30, Name = "Vite",                      Category = "Tools & Platforms", Proficiency = 2 },
        new() { Id = 31, Name = "DocFX",                     Category = "Tools & Platforms", Proficiency = 1 },
        new() { Id = 32, Name = "Selenium",                  Category = "Tools & Platforms", Proficiency = 1 },

        // Practices
        new() { Id = 33, Name = "Agile Scrum",               Category = "Practices", Proficiency = 3 },
        new() { Id = 34, Name = "CI/CD",                     Category = "Practices", Proficiency = 2 },
        new() { Id = 35, Name = "Code Reviews",              Category = "Practices", Proficiency = 3 },
        new() { Id = 36, Name = "Software Documentation",    Category = "Practices", Proficiency = 2 }
    ];

    [HttpGet]
    public ActionResult<IEnumerable<Skill>> GetAll()
    {
        return Ok(Skills);
    }
}
