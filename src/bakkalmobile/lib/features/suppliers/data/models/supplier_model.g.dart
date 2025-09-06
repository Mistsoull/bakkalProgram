// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'supplier_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SupplierModel _$SupplierModelFromJson(Map<String, dynamic> json) =>
    SupplierModel(
      id: json['id'] as String,
      nameSurname: json['nameSurname'] as String,
      companyName: json['companyName'] as String,
      phoneNumber: json['phoneNumber'] as String,
      note: json['note'] as String?,
      createdDate: json['createdDate'] == null
          ? null
          : DateTime.parse(json['createdDate'] as String),
      updatedDate: json['updatedDate'] == null
          ? null
          : DateTime.parse(json['updatedDate'] as String),
    );

Map<String, dynamic> _$SupplierModelToJson(SupplierModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'nameSurname': instance.nameSurname,
      'companyName': instance.companyName,
      'phoneNumber': instance.phoneNumber,
      'note': instance.note,
      'createdDate': instance.createdDate?.toIso8601String(),
      'updatedDate': instance.updatedDate?.toIso8601String(),
    };

CreateSupplierRequest _$CreateSupplierRequestFromJson(
        Map<String, dynamic> json) =>
    CreateSupplierRequest(
      nameSurname: json['nameSurname'] as String,
      companyName: json['companyName'] as String,
      phoneNumber: json['phoneNumber'] as String,
      note: json['note'] as String?,
    );

Map<String, dynamic> _$CreateSupplierRequestToJson(
        CreateSupplierRequest instance) =>
    <String, dynamic>{
      'nameSurname': instance.nameSurname,
      'companyName': instance.companyName,
      'phoneNumber': instance.phoneNumber,
      'note': instance.note,
    };

UpdateSupplierRequest _$UpdateSupplierRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateSupplierRequest(
      id: json['id'] as String,
      nameSurname: json['nameSurname'] as String,
      companyName: json['companyName'] as String,
      phoneNumber: json['phoneNumber'] as String,
      note: json['note'] as String?,
    );

Map<String, dynamic> _$UpdateSupplierRequestToJson(
        UpdateSupplierRequest instance) =>
    <String, dynamic>{
      'id': instance.id,
      'nameSurname': instance.nameSurname,
      'companyName': instance.companyName,
      'phoneNumber': instance.phoneNumber,
      'note': instance.note,
    };
