using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using tabtempo_api.Data;
using tabtempo_api.DTOs;
using System.Text.Json;

namespace tabtempo_api.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly TabTempoDbContext _db;
        public ChatHub(TabTempoDbContext db) => _db = db;
        public override async Task OnConnectedAsync()
        {
            // Pull the roomId route parameter
            var httpContext = Context.GetHttpContext();
            var roomId = httpContext?.Request.RouteValues["roomId"]?.ToString();

            if (!string.IsNullOrEmpty(roomId))
            {
                // Automatically join the group named by roomId
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            }

            await base.OnConnectedAsync();
        }
        // (You can add hub methods here—e.g., SendMessage, etc.)
        public async Task SendEvent(EventDto eventDto)
        {
            // Persist to Postgres
            var evt = new Event
            {
                RoomId = eventDto.RoomId,
                EventType = eventDto.EventType,
                Payload = JsonDocument.Parse(eventDto.Payload.GetRawText()),
                CreatedAt = DateTime.UtcNow
            };
            _db.Events.Add(evt);
            await _db.SaveChangesAsync();

            // Then broadcast
            await Clients
                .Group(eventDto.RoomId)
                .SendAsync("ReceiveEvent", eventDto);
        }
    }
}
