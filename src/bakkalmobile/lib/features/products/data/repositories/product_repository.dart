import 'package:dio/dio.dart';
import '../../../../core/network/api_service.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/models/paginated_response.dart';
import '../models/product_model.dart';

class ProductRepository {
  final ApiService _apiService;

  ProductRepository(this._apiService);

  Future<PaginatedResponse<ProductModel>> getProducts({
    int pageIndex = 0,
    int pageSize = 10,
  }) async {
    try {
      final response = await _apiService.dio.get(
        ApiConstants.products,
        queryParameters: {'PageIndex': pageIndex, 'PageSize': pageSize},
      );

      return PaginatedResponse.fromJson(
        response.data,
        (json) => ProductModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      throw Exception('Failed to fetch products: ${e.message}');
    }
  }

  Future<ProductModel> getProductById(String id) async {
    try {
      final response = await _apiService.dio.get(
        '${ApiConstants.products}/$id',
      );
      return ProductModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to fetch product: ${e.message}');
    }
  }

  Future<ProductModel> createProduct(CreateProductRequest request) async {
    try {
      final response = await _apiService.dio.post(
        ApiConstants.products,
        data: request.toJson(),
      );
      return ProductModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to create product: ${e.message}');
    }
  }

  Future<ProductModel> updateProduct(UpdateProductRequest request) async {
    try {
      final response = await _apiService.dio.put(
        '${ApiConstants.products}/${request.id}',
        data: request.toJson(),
      );
      return ProductModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to update product: ${e.message}');
    }
  }

  Future<void> deleteProduct(String id) async {
    try {
      await _apiService.dio.delete('${ApiConstants.products}/$id');
    } on DioException catch (e) {
      throw Exception('Failed to delete product: ${e.message}');
    }
  }
}
