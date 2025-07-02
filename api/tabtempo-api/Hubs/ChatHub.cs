using Microsoft.AspNetCore.SignalR;

namespace tabtempo_api.Hubs
{
    public class ChatHub : Hub
    {
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
    }
}
