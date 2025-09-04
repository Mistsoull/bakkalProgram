using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class ProcurementOrderItemConfiguration : IEntityTypeConfiguration<ProcurementOrderItem>
{
    public void Configure(EntityTypeBuilder<ProcurementOrderItem> builder)
    {
        builder.ToTable("ProcurementOrderItems").HasKey(poi => poi.Id);

        builder.Property(poi => poi.Id).HasColumnName("Id").IsRequired();
        builder.Property(poi => poi.ProcurementOrderId).HasColumnName("ProcurementOrderId").IsRequired();
        builder.Property(poi => poi.ProductName).HasColumnName("ProductName").IsRequired().HasMaxLength(200);
        builder.Property(poi => poi.Quantity).HasColumnName("Quantity").IsRequired();
        builder.Property(poi => poi.UnitPrice).HasColumnName("UnitPrice").IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(poi => poi.TotalPrice).HasColumnName("TotalPrice").IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(poi => poi.Notes).HasColumnName("Notes").HasMaxLength(500);
        builder.Property(poi => poi.ProductId).HasColumnName("ProductId");
        builder.Property(poi => poi.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(poi => poi.UpdatedDate).HasColumnName("UpdatedDate");
        builder.Property(poi => poi.DeletedDate).HasColumnName("DeletedDate");

        // Relationships
        builder.HasOne(poi => poi.ProcurementOrder)
               .WithMany(po => po.Items)
               .HasForeignKey(poi => poi.ProcurementOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(poi => poi.Product)
               .WithMany()
               .HasForeignKey(poi => poi.ProductId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasQueryFilter(poi => !poi.DeletedDate.HasValue);
    }
}
