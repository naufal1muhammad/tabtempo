using tabtempo_api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Cors.Infrastructure;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TabTempoDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddControllers();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViewerPolicy", policy =>
    {
        policy
        .WithOrigins("http://localhost:5173") // <— your Vite dev server origin
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

app.UseRouting();
app.UseCors("ViewerPolicy");
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapHub<tabtempo_api.Hubs.ChatHub>("/hub/{roomId}");
});

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TabTempoDbContext>();
    db.Database.EnsureCreated();
}

app.Run();