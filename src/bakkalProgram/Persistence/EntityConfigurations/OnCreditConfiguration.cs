using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Persistence.EntityConfigurations;

public class OnCreditConfiguration : IEntityTypeConfiguration<OnCredit>
{
    public void Configure(EntityTypeBuilder<OnCredit> builder)
    {
        builder.ToTable("OnCredits").HasKey(oc => oc.Id);

        builder.Property(oc => oc.Id).HasColumnName("Id").IsRequired();
        builder.Property(oc => oc.EmployeeName).HasColumnName("EmployeeName");
        builder.Property(oc => oc.EmployeeSurname).HasColumnName("EmployeeSurname");
        builder.Property(oc => oc.CustomerName).HasColumnName("CustomerName");
        builder.Property(oc => oc.CustomerSurname).HasColumnName("CustomerSurname");
        builder.Property(oc => oc.Note).HasColumnName("Note");
        builder.Property(oc => oc.IsPaid).HasColumnName("IsPaid").IsRequired();
        builder.Property(oc => oc.TotalAmount).HasColumnName("TotalAmount").IsRequired();
        builder.Property(oc => oc.EmployeeId).HasColumnName("EmployeeId");
        builder.Property(oc => oc.CreatedDate).HasColumnName("CreatedDate").IsRequired();
        builder.Property(oc => oc.UpdatedDate).HasColumnName("UpdatedDate");
        builder.Property(oc => oc.DeletedDate).HasColumnName("DeletedDate");

        builder.HasQueryFilter(oc => !oc.DeletedDate.HasValue);
    }
}