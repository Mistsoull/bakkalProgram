using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class OnCredit : Entity<Guid>
    {
        public string EmployeeName { get; set; }
        public string Note { get; set; }
        public bool IsPaid { get; set; }
        public double TotalAmount { get; set; }
        public Guid? EmployeeId { get; set; }
        public Employee Employee { get; set; }
    }
}