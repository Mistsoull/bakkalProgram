using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class OrderItem : Entity<Guid>
    {
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        
        public Guid? ProductId { get; set; }
        public Product? Product { get; set; }
        
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        
        public OrderItem()
        {
            
        }
        
        public OrderItem(Guid orderId, Guid? productId, string productName, int quantity, decimal? unitPrice = null)
        {
            OrderId = orderId;
            ProductId = productId;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
        }
    }
}
