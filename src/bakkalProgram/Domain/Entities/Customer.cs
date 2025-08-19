using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class Customer : Entity<Guid>
    {
        public string Name { get; set; }
        public string Surname { get; set; }
        public string PhoneNumber { get; set; }
        public string Note { get; set; }
    }
}