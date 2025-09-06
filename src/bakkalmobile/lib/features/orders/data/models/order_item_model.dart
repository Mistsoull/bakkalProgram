import 'package:json_annotation/json_annotation.dart';

part 'order_item_model.g.dart';

@JsonSerializable()
class OrderItemModel {
  final String id;
  final String? orderId;
  final String? productId;
  final String productName;
  final int quantity;
  final double unitPrice;
  final DateTime? createdDate;
  final DateTime? updatedDate;

  const OrderItemModel({
    required this.id,
    this.orderId,
    this.productId,
    required this.productName,
    required this.quantity,
    required this.unitPrice,
    this.createdDate,
    this.updatedDate,
  });

  factory OrderItemModel.fromJson(Map<String, dynamic> json) =>
      _$OrderItemModelFromJson(json);

  Map<String, dynamic> toJson() => _$OrderItemModelToJson(this);

  OrderItemModel copyWith({
    String? id,
    String? orderId,
    String? productId,
    String? productName,
    int? quantity,
    double? unitPrice,
    DateTime? createdDate,
    DateTime? updatedDate,
  }) {
    return OrderItemModel(
      id: id ?? this.id,
      orderId: orderId ?? this.orderId,
      productId: productId ?? this.productId,
      productName: productName ?? this.productName,
      quantity: quantity ?? this.quantity,
      unitPrice: unitPrice ?? this.unitPrice,
      createdDate: createdDate ?? this.createdDate,
      updatedDate: updatedDate ?? this.updatedDate,
    );
  }

  double get totalPrice => unitPrice * quantity;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is OrderItemModel && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'OrderItemModel(id: $id, productName: $productName, quantity: $quantity, unitPrice: $unitPrice)';
  }
}
