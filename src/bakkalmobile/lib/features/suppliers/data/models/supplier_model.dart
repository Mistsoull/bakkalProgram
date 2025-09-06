import 'package:json_annotation/json_annotation.dart';

part 'supplier_model.g.dart';

@JsonSerializable()
class SupplierModel {
  final String id;
  final String nameSurname;
  final String companyName;
  final String phoneNumber;
  final String? note;
  final DateTime? createdDate;
  final DateTime? updatedDate;

  const SupplierModel({
    required this.id,
    required this.nameSurname,
    required this.companyName,
    required this.phoneNumber,
    this.note,
    this.createdDate,
    this.updatedDate,
  });

  factory SupplierModel.fromJson(Map<String, dynamic> json) =>
      _$SupplierModelFromJson(json);

  Map<String, dynamic> toJson() => _$SupplierModelToJson(this);
}

@JsonSerializable()
class CreateSupplierRequest {
  final String nameSurname;
  final String companyName;
  final String phoneNumber;
  final String? note;

  const CreateSupplierRequest({
    required this.nameSurname,
    required this.companyName,
    required this.phoneNumber,
    this.note,
  });

  factory CreateSupplierRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateSupplierRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateSupplierRequestToJson(this);
}

@JsonSerializable()
class UpdateSupplierRequest {
  final String id;
  final String nameSurname;
  final String companyName;
  final String phoneNumber;
  final String? note;

  const UpdateSupplierRequest({
    required this.id,
    required this.nameSurname,
    required this.companyName,
    required this.phoneNumber,
    this.note,
  });

  factory UpdateSupplierRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateSupplierRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateSupplierRequestToJson(this);
}
