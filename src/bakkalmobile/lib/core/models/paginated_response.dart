import 'package:json_annotation/json_annotation.dart';

part 'paginated_response.g.dart';

@JsonSerializable(genericArgumentFactories: true)
class PaginatedResponse<T> {
  final int index;
  final int size;
  final int count;
  final int pages;
  final List<T> items;
  final bool hasPrevious;
  final bool hasNext;

  const PaginatedResponse({
    required this.index,
    required this.size,
    required this.count,
    required this.pages,
    required this.items,
    required this.hasPrevious,
    required this.hasNext,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Object? json) fromJsonT,
  ) => _$PaginatedResponseFromJson(json, fromJsonT);

  Map<String, dynamic> toJson(Object Function(T value) toJsonT) =>
      _$PaginatedResponseToJson(this, toJsonT);
}
