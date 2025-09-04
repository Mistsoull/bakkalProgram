using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class Supplier : Entity<Guid>
    {
        public string NameSurname { get; set; }
        public string CompanyName { get; set; }
        public string PhoneNumber { get; set; }
        public string? Note { get; set; }
        public virtual ICollection<ProcurementOrder> ProcurementOrders { get; set; }
        
        public Supplier()
        {
            NameSurname = string.Empty;
            CompanyName = string.Empty;
            PhoneNumber = string.Empty;
            ProcurementOrders = new HashSet<ProcurementOrder>();
        }
        
        public Supplier(string nameSurname, string companyName, string phoneNumber, string? note = null)
        {
            NameSurname = nameSurname;
            CompanyName = companyName;
            PhoneNumber = phoneNumber;
            Note = note;
            ProcurementOrders = new HashSet<ProcurementOrder>();
        }
    }
}