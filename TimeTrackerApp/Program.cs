using GraphQL;
using System.Text;
using GraphQL.Types;
using GraphQL.Server;
using GraphQL.Validation;
using GraphQL.MicrosoftDI;
using GraphQL.Authorization;
using GraphQL.SystemTextJson;
using TimeTrackerApp.Business.Repositories;
using TimeTrackerApp.MsSql.Repositories;
using TimeTrackerApp.GraphQL.GraphQLSchema;
using TimeTrackerApp.Helpers;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TimeTrackerApp.Handlers;
using TimeTrackerApp.Business.Services;
using System;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString(Constants.DatabaseConnectionString);


builder.Services.AddSingleton<IAuthenticationTokenRepository>(provider => new AuthenticationTokenRepository(connectionString));
builder.Services.AddSingleton<IRecordRepository>(provider => new RecordRepository(connectionString));
builder.Services.AddSingleton<IUserRepository>(provider => new UserRepository(connectionString));
builder.Services.AddSingleton<IVacationRequestRepository>(provider => new VacationRequestRepository(connectionString));

builder.Services.AddTransient<AuthorizationSettings>(provider => new CustomAuthorizationSettings());
builder.Services.AddTransient<IValidationRule, AuthorizationValidationRule>();
builder.Services.AddTransient<IAuthorizationEvaluator, AuthorizationEvaluator>();
// Add services to the container.

builder.Services.AddCors(
    builder => {
        builder.AddPolicy("DefaultPolicy", option =>
        {
            option.AllowAnyMethod();
            option.AllowAnyOrigin();
            option.AllowAnyHeader();
        });
    }
);

JwtTokenService.Configuration = builder.Configuration;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration[$"Jwt:{Constants.JwtTokenIssuer}"],
        ValidAudience = builder.Configuration[$"Jwt:{Constants.JwtTokenAudience}"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration[$"Jwt:{Constants.JwtSecretKey}"])),
        ClockSkew = TimeSpan.Zero
    };
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
});

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddControllersWithViews();

builder.Services.AddGraphQL(b => b
                .AddHttpMiddleware<ISchema>()
                .AddUserContextBuilder(context => new GraphQLUserContext(context.User))
                .AddValidationRule<AuthorizationValidationRule>()
                .AddSystemTextJson()
                .AddErrorInfoProvider(options => options.ExposeExceptionStackTrace = true)
                .AddSchema<AppSchema>()
                .AddGraphTypes(typeof(AppSchema).Assembly));

// In production, the React files will be served from this directory
builder.Services.AddSpaStaticFiles(configuration =>
{
    configuration.RootPath = "ClientApp/build";
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{ }

app.UseCors("DefaultPolicy");


app.UseAuthentication();
app.UseRouting();
app.UseAuthorization();

app.MapControllers();

app.UseDeveloperExceptionPage();
app.UseHsts();
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSpaStaticFiles();

app.UseGraphQL<ISchema>();

app.UseGraphQLAltair();

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (app.Environment.IsDevelopment())
    {
        spa.UseReactDevelopmentServer(npmScript: "start");
    }
});

app.Run();