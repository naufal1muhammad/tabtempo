using System.Text.Json;

namespace tabtempo_api.DTOs
{
    public class EventDto
    {
        public string RoomId { get; set; }
        public string EventType { get; set; }
        public JsonElement Payload { get; set; }
    }
}