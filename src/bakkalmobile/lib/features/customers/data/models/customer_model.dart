import 'package:json_annotation/json_annotation.dart';

part 'customer_model.g.dart';

@JsonSerializable()
class CustomerModel {
  final String id;
  final String name;
  final String surname;
  final String phoneNumber;
  final String? note;
  final DateTime? createdDate;
  final DateTime? updatedDate;

  const CustomerModel({
    required this.id,
    required this.name,
    required this.surname,
    required this.phoneNumber,
    this.note,
    this.createdDate,
    this.updatedDate,
  });

  factory CustomerModel.fromJson(Map<String, dynamic> json) =>
      _$CustomerModelFromJson(json);

  Map<String, dynamic> toJson() => _$CustomerModelToJson(this);

  String get fullName => '$name $surname';
}

@JsonSerializable()
class CreateCustomerRequest {
  final String name;
  final String surname;
  final String phoneNumber;
  final String? note;

  const CreateCustomerRequest({
    required this.name,
    required this.surname,
    required this.phoneNumber,
    this.note,
  });

  factory CreateCustomerRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateCustomerRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateCustomerRequestToJson(this);
}

@JsonSerializable()
class UpdateCustomerRequest {
  final String id;
  final String name;
  final String surname;
  final String phoneNumber;
  final String? note;

  const UpdateCustomerRequest({
    required this.id,
    required this.name,
    required this.surname,
    required this.phoneNumber,
    this.note,
  });

  factory UpdateCustomerRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateCustomerRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateCustomerRequestToJson(this);
}
