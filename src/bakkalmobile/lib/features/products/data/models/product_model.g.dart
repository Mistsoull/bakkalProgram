// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'product_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductModel _$ProductModelFromJson(Map<String, dynamic> json) => ProductModel(
      id: json['id'] as String,
      name: json['name'] as String,
      price: ProductModel._priceFromJson(json['price']),
      categoryId: ProductModel._categoryIdFromJson(json['categoryId']),
      categoryName: json['categoryName'] as String?,
      category: json['category'] == null
          ? null
          : CategoryInfo.fromJson(json['category'] as Map<String, dynamic>),
      createdDate: json['createdDate'] == null
          ? null
          : DateTime.parse(json['createdDate'] as String),
      updatedDate: json['updatedDate'] == null
          ? null
          : DateTime.parse(json['updatedDate'] as String),
    );

Map<String, dynamic> _$ProductModelToJson(ProductModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'price': ProductModel._priceToJson(instance.price),
      'categoryId': instance.categoryId,
      'categoryName': instance.categoryName,
      'category': instance.category,
      'createdDate': instance.createdDate?.toIso8601String(),
      'updatedDate': instance.updatedDate?.toIso8601String(),
    };

CategoryInfo _$CategoryInfoFromJson(Map<String, dynamic> json) => CategoryInfo(
      id: json['id'] as String,
      name: json['name'] as String,
    );

Map<String, dynamic> _$CategoryInfoToJson(CategoryInfo instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
    };

CreateProductRequest _$CreateProductRequestFromJson(
        Map<String, dynamic> json) =>
    CreateProductRequest(
      name: json['name'] as String,
      price: CreateProductRequest._priceFromJson(json['price']),
      categoryId: json['categoryId'] as String,
    );

Map<String, dynamic> _$CreateProductRequestToJson(
        CreateProductRequest instance) =>
    <String, dynamic>{
      'name': instance.name,
      'price': CreateProductRequest._priceToJson(instance.price),
      'categoryId': instance.categoryId,
    };

UpdateProductRequest _$UpdateProductRequestFromJson(
        Map<String, dynamic> json) =>
    UpdateProductRequest(
      id: json['id'] as String,
      name: json['name'] as String,
      price: UpdateProductRequest._priceFromJson(json['price']),
      categoryId: json['categoryId'] as String,
    );

Map<String, dynamic> _$UpdateProductRequestToJson(
        UpdateProductRequest instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'price': UpdateProductRequest._priceToJson(instance.price),
      'categoryId': instance.categoryId,
    };
