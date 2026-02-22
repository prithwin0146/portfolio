var builder = WebApplication.CreateBuilder(args);

// Railway sets PORT env var — bind to it
var port = Environment.GetEnvironmentVariable("PORT") ?? "5062";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<Portfolio.Api.Services.ContactStore>();

// CORS: allow local dev + production Vercel domain
var allowedOrigins = new List<string>
{
    "http://localhost:5173",
    "http://localhost:5174"
};

var productionOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN");
if (!string.IsNullOrEmpty(productionOrigin))
    allowedOrigins.Add(productionOrigin);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins(allowedOrigins.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowClient");
app.UseAuthorization();
app.MapControllers();

app.Run();
