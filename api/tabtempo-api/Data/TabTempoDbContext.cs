using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace tabtempo_api.Data
{
    public class TabTempoDbContext : DbContext
    {
        public TabTempoDbContext(DbContextOptions<TabTempoDbContext> options)
            : base(options)
        { }

        public DbSet<Event> Events { get; set; }
        public DbSet<Room> Rooms { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Event>(eb =>
            {
                eb.ToTable("events");
                eb.Property(e => e.Id).HasColumnName("id");
                eb.Property(e => e.RoomId).HasColumnName("room_id");
                eb.Property(e => e.EventType).HasColumnName("event_type");
                eb.Property(e => e.Payload).HasColumnName("payload").HasColumnName("payload").HasColumnType("jsonb");
                eb.Property(e => e.CreatedAt).HasColumnName("created_at");
            });

            builder.Entity<Room>(eb =>
            {
                eb.ToTable("rooms");
                eb.HasKey(r => r.Id).HasName("pk_rooms");
                eb.Property(r => r.Id).HasColumnName("id");
                eb.Property(r => r.Name).HasColumnName("name");
                eb.Property(r => r.CreatedAt).HasColumnName("created_at");
            });
        }
    }

    public class Event
    {
        public int Id { get; set; }
        public string RoomId { get; set; }
        public string EventType { get; set; }
        public JsonDocument Payload { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}