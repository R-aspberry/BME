using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace MERL.API.Models;

public partial class BmeDbContext : DbContext
{
    public BmeDbContext(DbContextOptions<BmeDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
