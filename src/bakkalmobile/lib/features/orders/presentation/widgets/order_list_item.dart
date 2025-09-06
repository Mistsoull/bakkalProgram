import 'package:flutter/material.dart';
import '../../data/models/order_model.dart';

class OrderListItem extends StatelessWidget {
  final OrderModel order;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  final VoidCallback onMarkAsDelivered;
  final VoidCallback onMarkAsPaid;

  const OrderListItem({
    super.key,
    required this.order,
    required this.onTap,
    required this.onEdit,
    required this.onDelete,
    required this.onMarkAsDelivered,
    required this.onMarkAsPaid,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
      elevation: 2,
      child: ListTile(
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: _getStatusColor().withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(25),
          ),
          child: Icon(_getStatusIcon(), color: _getStatusColor(), size: 28),
        ),
        title: Text(
          order.fullCustomerName,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '${order.uniqueProductCount} ürün • ${order.totalItemCount} adet',
              style: TextStyle(color: Colors.grey.shade600, fontSize: 12),
            ),
            const SizedBox(height: 2),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: _getStatusColor().withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    order.statusText,
                    style: TextStyle(
                      color: _getStatusColor(),
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '₺${order.totalAmount.toStringAsFixed(2)}',
                  style: const TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: Colors.green,
                  ),
                ),
              ],
            ),
          ],
        ),
        trailing: PopupMenuButton<String>(
          onSelected: (value) {
            switch (value) {
              case 'edit':
                onEdit();
                break;
              case 'delete':
                onDelete();
                break;
              case 'deliver':
                onMarkAsDelivered();
                break;
              case 'pay':
                onMarkAsPaid();
                break;
            }
          },
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'edit',
              child: Row(
                children: [
                  Icon(Icons.edit, size: 20),
                  SizedBox(width: 8),
                  Text('Düzenle'),
                ],
              ),
            ),
            if (!order.isDelivered)
              const PopupMenuItem(
                value: 'deliver',
                child: Row(
                  children: [
                    Icon(Icons.local_shipping, size: 20, color: Colors.blue),
                    SizedBox(width: 8),
                    Text('Teslim Et', style: TextStyle(color: Colors.blue)),
                  ],
                ),
              ),
            if (!order.isPaid)
              const PopupMenuItem(
                value: 'pay',
                child: Row(
                  children: [
                    Icon(Icons.payment, size: 20, color: Colors.green),
                    SizedBox(width: 8),
                    Text('Öde', style: TextStyle(color: Colors.green)),
                  ],
                ),
              ),
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete, size: 20, color: Colors.red),
                  SizedBox(width: 8),
                  Text('Sil', style: TextStyle(color: Colors.red)),
                ],
              ),
            ),
          ],
        ),
        onTap: onTap,
      ),
    );
  }

  Color _getStatusColor() {
    if (order.isDelivered) return Colors.green;
    if (order.isPaid) return Colors.blue;
    return Colors.orange;
  }

  IconData _getStatusIcon() {
    if (order.isDelivered) return Icons.check_circle;
    if (order.isPaid) return Icons.payment;
    return Icons.schedule;
  }
}
