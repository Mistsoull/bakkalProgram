using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class ProcurementOrderConfiguration : IEntityTypeConfiguration<ProcurementOrder>
{
    public void Configure(EntityTypeBuilder<ProcurementOrder> builder)
    {
        builder.ToTable("ProcurementOrders").HasKey(po => po.Id);

        builder.Property(po => po.Id).HasColumnName("Id").IsRequired();
        builder.Property(po => po.SupplierName).HasColumnName("SupplierName").IsRequired().HasMaxLength(200);
        builder.Property(po => po.TotalAmount).HasColumnName("TotalAmount").IsRequired().HasColumnType("decimal(18,2)");
        builder.Property(po => po.OrderDate).HasColumnName("OrderDate").IsRequired();
        builder.Property(po => po.ExpectedDeliveryDate).HasColumnName("ExpectedDeliveryDate");
        builder.Property(po => po.IsReceived).HasColumnName("IsReceived").IsRequired();
        builder.Property(po => po.IsPaid).HasColumnName("IsPaid").IsRequired();
        builder.Property(po => po.Notes).HasColumnName("Notes").HasMaxLength(1000);
        builder.Property(po => po.SupplierId).HasColumnName("SupplierId");
        builder.Property(po => po.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(po => po.UpdatedDate).HasColumnName("UpdatedDate");
        builder.Property(po => po.DeletedDate).HasColumnName("DeletedDate");

        // Relationships
        builder.HasOne(po => po.Supplier)
               .WithMany(s => s.ProcurementOrders)
               .HasForeignKey(po => po.SupplierId)
               .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(po => po.Items)
               .WithOne(poi => poi.ProcurementOrder)
               .HasForeignKey(poi => poi.ProcurementOrderId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasQueryFilter(po => !po.DeletedDate.HasValue);
    }
}