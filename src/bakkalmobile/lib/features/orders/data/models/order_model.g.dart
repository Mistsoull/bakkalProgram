// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'order_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OrderModel _$OrderModelFromJson(Map<String, dynamic> json) => OrderModel(
      id: json['id'] as String,
      customerName: json['customerName'] as String,
      customerSurname: json['customerSurname'] as String?,
      deliveryDate: DateTime.parse(json['deliveryDate'] as String),
      isPaid: json['isPaid'] as bool,
      isDelivered: json['isDelivered'] as bool,
      customerId: json['customerId'] as String?,
      items: (json['items'] as List<dynamic>)
          .map((e) => OrderItemModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      createdDate: json['createdDate'] == null
          ? null
          : DateTime.parse(json['createdDate'] as String),
      updatedDate: json['updatedDate'] == null
          ? null
          : DateTime.parse(json['updatedDate'] as String),
    );

Map<String, dynamic> _$OrderModelToJson(OrderModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'customerName': instance.customerName,
      'customerSurname': instance.customerSurname,
      'deliveryDate': instance.deliveryDate.toIso8601String(),
      'isPaid': instance.isPaid,
      'isDelivered': instance.isDelivered,
      'customerId': instance.customerId,
      'items': instance.items,
      'createdDate': instance.createdDate?.toIso8601String(),
      'updatedDate': instance.updatedDate?.toIso8601String(),
    };
