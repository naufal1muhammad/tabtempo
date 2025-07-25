using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using tabtempo_api.DTOs;

namespace tabtempo_api.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("join")]
        public ActionResult<object> Join([FromBody] JoinRequest request)
        {
            // 1) Read JWT settings
            var jwt = _config.GetSection("JwtSettings");
            var keyBytes = Encoding.UTF8.GetBytes(jwt["Key"]!);
            var creds = new SigningCredentials(
                new SymmetricSecurityKey(keyBytes),
                SecurityAlgorithms.HmacSha256
            );

            // 2) Create claims (including the roomId)
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, request.RoomId),
                new Claim("room", request.RoomId)
            };

            // 3) Build the token
            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(int.Parse(jwt["ExpiresInMinutes"]!)),
                signingCredentials: creds
            );
            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            // 4) Return the token
            return Ok(new { token = tokenString });
        }
    }
}