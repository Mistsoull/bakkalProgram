using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class Order : Entity<Guid>
    {
        public string CustomerName { get; set; }
        public string? CustomerSurname { get; set; }
        public DateTime DeliveryDate { get; set; }
        public bool isPaid { get; set; }
        public bool IsDelivered { get; set; }
        public Guid? CustomerId { get; set; }
        public Customer? Customer { get; set; }
        
        // Order Items
        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        
        public Order()
        {
            CustomerName = string.Empty;
            Items = new HashSet<OrderItem>();
        }
        
        public Order(string customerName, string? customerSurname = null, DateTime? deliveryDate = null, bool isPaid = false, Guid? customerId = null)
        {
            CustomerName = customerName;
            CustomerSurname = customerSurname;
            DeliveryDate = deliveryDate ?? DateTime.Now.AddDays(1);
            this.isPaid = isPaid;
            CustomerId = customerId;
            Items = new HashSet<OrderItem>();
        }
        
        public void AddItem(string productName, int quantity, decimal unitPrice, Guid? productId = null)
        {
            var orderItem = new OrderItem
            {
                ProductName = productName,
                Quantity = quantity,
                UnitPrice = unitPrice,
                ProductId = productId
            };
            Items.Add(orderItem);
        }
        
        public void RemoveItem(Guid itemId)
        {
            var item = Items.FirstOrDefault(i => i.Id == itemId);
            if (item != null)
            {
                Items.Remove(item);
            }
        }
        
        public decimal GetTotalAmount()
        {
            return Items?.Sum(i => (i.UnitPrice ?? 0) * i.Quantity) ?? 0;
        }
        
        public int GetTotalItemCount()
        {
            return Items?.Sum(i => i.Quantity) ?? 0;
        }
        
        public int GetUniqueProductCount()
        {
            return Items?.Count ?? 0;
        }
        
        // Backward compatibility - remove later
        [Obsolete("Use Items collection instead")]
        public string? ProductName { get; set; }
        [Obsolete("Use Items collection instead")]
        public int? Quantity { get; set; }
        [Obsolete("Use Items collection instead")]
        public Guid? ProductId { get; set; }
        [Obsolete("Use Items collection instead")]
        public Product? Product { get; set; }
    }
}