using SignalR_server;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSignalR();


builder.Services.AddCors(options =>
{
     options.AddPolicy("CorsPolicy",
         builder =>
         {
             builder
                 .AllowAnyHeader()
                 .AllowAnyMethod()
                 .AllowCredentials()
                 .SetIsOriginAllowed((host) => true);
         });
});


var app = builder.Build();

app.UseHttpsRedirection();
app.MapControllers();

app.UseCors("CorsPolicy");

app.MapHub<ChatHub>("/chat");

app.Run();
