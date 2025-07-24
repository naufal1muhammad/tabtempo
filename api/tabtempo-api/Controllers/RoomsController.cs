using Microsoft.AspNetCore.Mvc;
using tabtempo_api.Data;

namespace tabtempo_api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly TabTempoDbContext _db;
        public RoomsController(TabTempoDbContext db) => _db = db;

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateRoom([FromBody] string? name)
        {
            var room = new Room
            {
                Name = name ?? "Untitled Room"
            };
            _db.Rooms.Add(room);
            await _db.SaveChangesAsync();
            return CreatedAtAction(null, new { id = room.Id }, room.Id);
        }
    }
}