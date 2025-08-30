using MediatR;
using Microsoft.AspNetCore.Mvc;
using System.Reflection;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DiagnosticsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IServiceProvider _serviceProvider;

    public DiagnosticsController(IMediator mediator, IServiceProvider serviceProvider)
    {
        _mediator = mediator;
        _serviceProvider = serviceProvider;
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow });
    }

    [HttpGet("mediator-check")]
    public IActionResult MediatorCheck()
    {
        try
        {
            var mediatorService = _serviceProvider.GetService<IMediator>();
            
            if (mediatorService == null)
            {
                return StatusCode(500, new { 
                    Error = "MediatR service not found", 
                    Suggestion = "Check if MediatR is properly registered in dependency injection" 
                });
            }

            return Ok(new { 
                Status = "MediatR is properly registered",
                MediatorType = mediatorService.GetType().FullName
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                Error = ex.Message, 
                StackTrace = ex.StackTrace 
            });
        }
    }

    [HttpGet("registered-handlers")]
    public IActionResult GetRegisteredHandlers()
    {
        try
        {
            var assembly = Assembly.Load("Application");
            var handlerTypes = assembly.GetTypes()
                .Where(t => t.GetInterfaces().Any(i => 
                    i.IsGenericType && 
                    (i.GetGenericTypeDefinition() == typeof(IRequestHandler<,>) ||
                     i.GetGenericTypeDefinition() == typeof(IRequestHandler<>))))
                .Select(t => new {
                    HandlerName = t.Name,
                    FullName = t.FullName,
                    Interfaces = t.GetInterfaces().Select(i => i.Name).ToArray()
                })
                .ToList();

            return Ok(new {
                TotalHandlers = handlerTypes.Count,
                Handlers = handlerTypes
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                Error = ex.Message, 
                StackTrace = ex.StackTrace 
            });
        }
    }

    [HttpGet("connection-test")]
    public async Task<IActionResult> TestDatabaseConnection()
    {
        try
        {
            // Bu endpoint'i sadece development ortamında kullanın
            if (!HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
            {
                return BadRequest("This endpoint is only available in development environment");
            }

            var dbContext = HttpContext.RequestServices.GetRequiredService<Persistence.Contexts.BaseDbContext>();
            var canConnect = await dbContext.Database.CanConnectAsync();
            
            return Ok(new { 
                DatabaseConnected = canConnect,
                ConnectionString = "Connection string configured (hidden for security)" 
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { 
                Error = ex.Message, 
                Suggestion = "Check your database connection string and ensure the database server is accessible" 
            });
        }
    }
}
