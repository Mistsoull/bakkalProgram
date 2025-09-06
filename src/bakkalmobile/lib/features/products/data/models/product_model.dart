import 'package:json_annotation/json_annotation.dart';

part 'product_model.g.dart';

@JsonSerializable()
class ProductModel {
  final String id;
  final String name;
  @JsonKey(fromJson: _priceFromJson, toJson: _priceToJson)
  final double price;
  @JsonKey(fromJson: _categoryIdFromJson)
  final String categoryId;
  final String? categoryName;
  final CategoryInfo? category;
  final DateTime? createdDate;
  final DateTime? updatedDate;

  const ProductModel({
    required this.id,
    required this.name,
    required this.price,
    required this.categoryId,
    this.categoryName,
    this.category,
    this.createdDate,
    this.updatedDate,
  });

  factory ProductModel.fromJson(Map<String, dynamic> json) =>
      _$ProductModelFromJson(json);

  Map<String, dynamic> toJson() => _$ProductModelToJson(this);

  String get formattedPrice => '${price.toStringAsFixed(2)} ₺';

  String get displayCategoryName =>
      categoryName ?? category?.name ?? 'Kategori Yok';

  static double _priceFromJson(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  static dynamic _priceToJson(double value) => value;

  static String _categoryIdFromJson(dynamic value) {
    if (value == null) return '';
    return value.toString();
  }
}

@JsonSerializable()
class CategoryInfo {
  final String id;
  final String name;

  const CategoryInfo({required this.id, required this.name});

  factory CategoryInfo.fromJson(Map<String, dynamic> json) =>
      _$CategoryInfoFromJson(json);

  Map<String, dynamic> toJson() => _$CategoryInfoToJson(this);
}

@JsonSerializable()
class CreateProductRequest {
  final String name;
  @JsonKey(fromJson: _priceFromJson, toJson: _priceToJson)
  final double price;
  final String categoryId;

  const CreateProductRequest({
    required this.name,
    required this.price,
    required this.categoryId,
  });

  factory CreateProductRequest.fromJson(Map<String, dynamic> json) =>
      _$CreateProductRequestFromJson(json);

  Map<String, dynamic> toJson() => _$CreateProductRequestToJson(this);

  static double _priceFromJson(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  static dynamic _priceToJson(double value) => value;
}

@JsonSerializable()
class UpdateProductRequest {
  final String id;
  final String name;
  @JsonKey(fromJson: _priceFromJson, toJson: _priceToJson)
  final double price;
  final String categoryId;

  const UpdateProductRequest({
    required this.id,
    required this.name,
    required this.price,
    required this.categoryId,
  });

  factory UpdateProductRequest.fromJson(Map<String, dynamic> json) =>
      _$UpdateProductRequestFromJson(json);

  Map<String, dynamic> toJson() => _$UpdateProductRequestToJson(this);

  static double _priceFromJson(dynamic value) {
    if (value == null) return 0.0;
    if (value is double) return value;
    if (value is int) return value.toDouble();
    if (value is String) return double.tryParse(value) ?? 0.0;
    return 0.0;
  }

  static dynamic _priceToJson(double value) => value;
}
