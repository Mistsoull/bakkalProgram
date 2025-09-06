import 'package:json_annotation/json_annotation.dart';
import 'order_item_model.dart';

part 'order_model.g.dart';

@JsonSerializable()
class OrderModel {
  final String id;
  final String customerName;
  final String? customerSurname;
  final DateTime deliveryDate;
  final bool isPaid;
  final bool isDelivered;
  final String? customerId;
  final List<OrderItemModel> items;
  final DateTime? createdDate;
  final DateTime? updatedDate;

  const OrderModel({
    required this.id,
    required this.customerName,
    this.customerSurname,
    required this.deliveryDate,
    required this.isPaid,
    required this.isDelivered,
    this.customerId,
    required this.items,
    this.createdDate,
    this.updatedDate,
  });

  factory OrderModel.fromJson(Map<String, dynamic> json) =>
      _$OrderModelFromJson(json);

  Map<String, dynamic> toJson() => _$OrderModelToJson(this);

  OrderModel copyWith({
    String? id,
    String? customerName,
    String? customerSurname,
    DateTime? deliveryDate,
    bool? isPaid,
    bool? isDelivered,
    String? customerId,
    List<OrderItemModel>? items,
    DateTime? createdDate,
    DateTime? updatedDate,
  }) {
    return OrderModel(
      id: id ?? this.id,
      customerName: customerName ?? this.customerName,
      customerSurname: customerSurname ?? this.customerSurname,
      deliveryDate: deliveryDate ?? this.deliveryDate,
      isPaid: isPaid ?? this.isPaid,
      isDelivered: isDelivered ?? this.isDelivered,
      customerId: customerId ?? this.customerId,
      items: items ?? this.items,
      createdDate: createdDate ?? this.createdDate,
      updatedDate: updatedDate ?? this.updatedDate,
    );
  }

  String get fullCustomerName {
    return customerSurname != null && customerSurname!.isNotEmpty
        ? '$customerName $customerSurname'
        : customerName;
  }

  double get totalAmount {
    return items.fold(0.0, (sum, item) => sum + item.totalPrice);
  }

  int get totalItemCount {
    return items.fold(0, (sum, item) => sum + item.quantity);
  }

  int get uniqueProductCount {
    return items.length;
  }

  String get statusText {
    if (isDelivered) return 'Teslim Edildi';
    if (isPaid) return 'Ödendi';
    return 'Ödenmedi';
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is OrderModel && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'OrderModel(id: $id, customerName: $customerName, totalAmount: $totalAmount)';
  }
}
