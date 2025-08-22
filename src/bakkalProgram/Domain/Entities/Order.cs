using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class Order : Entity<Guid>
    {
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public string CustomerName { get; set; }
        public string? CustomerSurname { get; set; }
        public DateTime DeliveryDate { get; set; }
        public bool isPaid { get; set; }
        public bool IsDelivered { get; set; }
        public Guid? ProductId { get; set; }
        public Product Product { get; set; }
        public Guid? CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}