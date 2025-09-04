using NArchitecture.Core.Persistence.Repositories;

namespace Domain.Entities
{
    public class ProcurementOrder : Entity<Guid>
    {
        public string SupplierName { get; set; }
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;
        public DateTime? ExpectedDeliveryDate { get; set; }
        public bool IsReceived { get; set; } = false;
        public bool IsPaid { get; set; } = false;
        public string? Notes { get; set; }
        
        public Guid? SupplierId { get; set; }
        public virtual Supplier? Supplier { get; set; }
        public virtual ICollection<ProcurementOrderItem> Items { get; set; }
        
        public ProcurementOrder()
        {
            SupplierName = string.Empty;
            Items = new HashSet<ProcurementOrderItem>();
        }
        
        public ProcurementOrder(string supplierName, string? notes = null, Guid? supplierId = null, DateTime? expectedDeliveryDate = null, DateTime? orderDate = null)
        {
            SupplierName = supplierName;
            Notes = notes;
            SupplierId = supplierId;
            ExpectedDeliveryDate = expectedDeliveryDate;
            OrderDate = orderDate ?? DateTime.Now;
            Items = new HashSet<ProcurementOrderItem>();
            CalculateTotalAmount();
        }
        
        public void AddItem(string productName, int quantity, decimal unitPrice, string? notes = null, Guid? productId = null)
        {
            var item = new ProcurementOrderItem(Id, productName, quantity, unitPrice, notes, productId);
            Items.Add(item);
            CalculateTotalAmount();
        }
        
        public void RemoveItem(Guid itemId)
        {
            var item = Items.FirstOrDefault(i => i.Id == itemId);
            if (item != null)
            {
                Items.Remove(item);
                CalculateTotalAmount();
            }
        }
        
        public void CalculateTotalAmount()
        {
            TotalAmount = Items?.Sum(i => i.TotalPrice) ?? 0;
        }
        
        public int GetTotalItemCount()
        {
            return Items?.Sum(i => i.Quantity) ?? 0;
        }
        
        public int GetUniqueProductCount()
        {
            return Items?.Count ?? 0;
        }
    }
}