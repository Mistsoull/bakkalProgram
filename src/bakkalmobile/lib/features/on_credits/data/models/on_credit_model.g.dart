// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'on_credit_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OnCreditModel _$OnCreditModelFromJson(Map<String, dynamic> json) =>
    OnCreditModel(
      id: json['id'] as String,
      employeeName: json['employeeName'] as String?,
      employeeSurname: json['employeeSurname'] as String?,
      customerName: json['customerName'] as String?,
      customerSurname: json['customerSurname'] as String?,
      note: json['note'] as String?,
      isPaid: json['isPaid'] as bool,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      employeeId: json['employeeId'] as String?,
      customerId: json['customerId'] as String?,
      createdDate: json['createdDate'] == null
          ? null
          : DateTime.parse(json['createdDate'] as String),
      updatedDate: json['updatedDate'] == null
          ? null
          : DateTime.parse(json['updatedDate'] as String),
    );

Map<String, dynamic> _$OnCreditModelToJson(OnCreditModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'employeeName': instance.employeeName,
      'employeeSurname': instance.employeeSurname,
      'customerName': instance.customerName,
      'customerSurname': instance.customerSurname,
      'note': instance.note,
      'isPaid': instance.isPaid,
      'totalAmount': instance.totalAmount,
      'employeeId': instance.employeeId,
      'customerId': instance.customerId,
      'createdDate': instance.createdDate?.toIso8601String(),
      'updatedDate': instance.updatedDate?.toIso8601String(),
    };

CreateOnCreditRequest _$CreateOnCreditRequestFromJson(
        Map<String, dynamic> json) =>
    CreateOnCreditRequest(
      employeeName: json['employeeName'] as String?,
      employeeSurname: json['employeeSurname'] as String?,
      customerName: json['customerName'] as String?,
      customerSurname: json['customerSurname'] as String?,
      note: json['note'] as String?,
      isPaid: json['isPaid'] as bool,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      employeeId: json['employeeId'] as String?,
      customerId: json['customerId'] as String?,
    );

Map<String, dynamic> _$CreateOnCreditRequestToJson(
        CreateOnCreditRequest instance) =>
    <String, dynamic>{
      'employeeName': instance.employeeName,
      'employeeSurname': instance.employeeSurname,
      'customerName': instance.customerName,
      'customerSurname': instance.customerSurname,
      'note': instance.note,
      'isPaid': instance.isPaid,
      'totalAmount': instance.totalAmount,
      'employeeId': instance.employeeId,
      'customerId': instance.customerId,
    };

UpdateOnCreditRequest _$UpdateOnCreditRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateOnCreditRequest(
      id: json['id'] as String,
      employeeName: json['employeeName'] as String?,
      employeeSurname: json['employeeSurname'] as String?,
      customerName: json['customerName'] as String?,
      customerSurname: json['customerSurname'] as String?,
      note: json['note'] as String?,
      isPaid: json['isPaid'] as bool,
      totalAmount: (json['totalAmount'] as num).toDouble(),
      employeeId: json['employeeId'] as String?,
      customerId: json['customerId'] as String?,
    );

Map<String, dynamic> _$UpdateOnCreditRequestToJson(
        UpdateOnCreditRequest instance) =>
    <String, dynamic>{
      'id': instance.id,
      'employeeName': instance.employeeName,
      'employeeSurname': instance.employeeSurname,
      'customerName': instance.customerName,
      'customerSurname': instance.customerSurname,
      'note': instance.note,
      'isPaid': instance.isPaid,
      'totalAmount': instance.totalAmount,
      'employeeId': instance.employeeId,
      'customerId': instance.customerId,
    };
