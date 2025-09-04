using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class ProcurementOrderItem : Entity<Guid>
    {
        public Guid ProcurementOrderId { get; set; }
        public string ProductName { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public string? Notes { get; set; }
        
        public Guid? ProductId { get; set; }
        public virtual Product? Product { get; set; }
        public virtual ProcurementOrder ProcurementOrder { get; set; }
        
        public ProcurementOrderItem()
        {
            ProductName = string.Empty;
        }
        
        public ProcurementOrderItem(Guid procurementOrderId, string productName, int quantity, decimal unitPrice, string? notes = null, Guid? productId = null)
        {
            ProcurementOrderId = procurementOrderId;
            ProductName = productName;
            Quantity = quantity;
            UnitPrice = unitPrice;
            TotalPrice = quantity * unitPrice;
            Notes = notes;
            ProductId = productId;
        }
        
        public void UpdateTotalPrice()
        {
            TotalPrice = Quantity * UnitPrice;
        }
    }
}
