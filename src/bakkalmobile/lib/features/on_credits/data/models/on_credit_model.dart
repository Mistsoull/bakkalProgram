import 'package:json_annotation/json_annotation.dart';

part 'on_credit_model.g.dart';

@JsonSerializable()
class OnCreditModel {
  final String id;
  final String? employeeName;
  final String? employeeSurname;
  final String? customerName;
  final String? customerSurname;
  final String? note;
  final bool isPaid;
  final double totalAmount;
  final String? employeeId;
  final String? customerId;
  final DateTime? createdDate;
  final DateTime? updatedDate;

  const OnCreditModel({
    required this.id,
    this.employeeName,
    this.employeeSurname,
    this.customerName,
    this.customerSurname,
    this.note,
    required this.isPaid,
    required this.totalAmount,
    this.employeeId,
    this.customerId,
    this.createdDate,
    this.updatedDate,
  });

  factory OnCreditModel.fromJson(Map<String, dynamic> json) =>
      _$OnCreditModelFromJson(json);

  Map<String, dynamic> toJson() => _$OnCreditModelToJson(this);

  String get customerFullName =>
      '${customerName ?? ''} ${customerSurname ?? ''}'.trim();

  String get employeeFullName =>
      '${employeeName ?? ''} ${employeeSurname ?? ''}'.trim();

  String get formattedAmount => '${totalAmount.toStringAsFixed(2)} ₺';

  String get statusText => isPaid ? 'Ödendi' : 'Ödenmedi';
}

@JsonSerializable()
class CreateOnCreditRequest {
  final String? employeeName;
  final String? employeeSurname;
  final String? customerName;
  final String? customerSurname;
  final String? note;
  final bool isPaid;
  final double totalAmount;
  final String? employeeId;
  final String? customerId;

  const CreateOnCreditRequest({
    this.employeeName,
    this.employeeSurname,
    this.customerName,
    this.customerSurname,
    this.note,
    required this.isPaid,
    required this.totalAmount,
    this.employeeId,
    this.customerId,
  });

  factory CreateOnCreditRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateOnCreditRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateOnCreditRequestToJson(this);
}

@JsonSerializable()
class UpdateOnCreditRequest {
  final String id;
  final String? employeeName;
  final String? employeeSurname;
  final String? customerName;
  final String? customerSurname;
  final String? note;
  final bool isPaid;
  final double totalAmount;
  final String? employeeId;
  final String? customerId;

  const UpdateOnCreditRequest({
    required this.id,
    this.employeeName,
    this.employeeSurname,
    this.customerName,
    this.customerSurname,
    this.note,
    required this.isPaid,
    required this.totalAmount,
    this.employeeId,
    this.customerId,
  });

  factory UpdateOnCreditRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateOnCreditRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateOnCreditRequestToJson(this);
}
