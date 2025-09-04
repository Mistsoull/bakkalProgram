using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders").HasKey(o => o.Id);

        builder.Property(o => o.Id).HasColumnName("Id").IsRequired();
        builder.Property(o => o.CustomerName).HasColumnName("CustomerName").IsRequired();
        builder.Property(o => o.CustomerSurname).HasColumnName("CustomerSurname");
        builder.Property(o => o.DeliveryDate).HasColumnName("DeliveryDate").IsRequired();
        builder.Property(o => o.isPaid).HasColumnName("isPaid").IsRequired();
        builder.Property(o => o.IsDelivered).HasColumnName("IsDelivered").IsRequired();
        builder.Property(o => o.CustomerId).HasColumnName("CustomerId");
        
        // Backward compatibility columns - keep for existing data
        builder.Property(o => o.ProductName).HasColumnName("ProductName");
        builder.Property(o => o.Quantity).HasColumnName("Quantity");
        builder.Property(o => o.ProductId).HasColumnName("ProductId");
        
        builder.Property(o => o.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(o => o.UpdatedDate).HasColumnName("UpdatedDate");
        builder.Property(o => o.DeletedDate).HasColumnName("DeletedDate");

        // Relationships
        builder.HasMany(o => o.Items)
               .WithOne(oi => oi.Order)
               .HasForeignKey(oi => oi.OrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(o => !o.DeletedDate.HasValue);
    }
}