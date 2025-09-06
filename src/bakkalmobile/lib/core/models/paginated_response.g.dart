// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'paginated_response.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PaginatedResponse<T> _$PaginatedResponseFromJson<T>(
  Map<String, dynamic> json,
  T Function(Object? json) fromJsonT,
) =>
    PaginatedResponse<T>(
      index: (json['index'] as num).toInt(),
      size: (json['size'] as num).toInt(),
      count: (json['count'] as num).toInt(),
      pages: (json['pages'] as num).toInt(),
      items: (json['items'] as List<dynamic>).map(fromJsonT).toList(),
      hasPrevious: json['hasPrevious'] as bool,
      hasNext: json['hasNext'] as bool,
    );

Map<String, dynamic> _$PaginatedResponseToJson<T>(
  PaginatedResponse<T> instance,
  Object? Function(T value) toJsonT,
) =>
    <String, dynamic>{
      'index': instance.index,
      'size': instance.size,
      'count': instance.count,
      'pages': instance.pages,
      'items': instance.items.map(toJsonT).toList(),
      'hasPrevious': instance.hasPrevious,
      'hasNext': instance.hasNext,
    };
