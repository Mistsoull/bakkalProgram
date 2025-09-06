import 'package:dio/dio.dart';
import '../../../../core/network/api_service.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/models/paginated_response.dart';
import '../models/supplier_model.dart';

class SupplierRepository {
  final ApiService _apiService;

  SupplierRepository(this._apiService);

  Future<PaginatedResponse<SupplierModel>> getSuppliers({
    int pageIndex = 0,
    int pageSize = 10,
  }) async {
    try {
      final response = await _apiService.dio.get(
        ApiConstants.suppliers,
        queryParameters: {'PageIndex': pageIndex, 'PageSize': pageSize},
      );

      return PaginatedResponse.fromJson(
        response.data,
        (json) => SupplierModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      throw Exception('Failed to fetch suppliers: ${e.message}');
    }
  }

  Future<SupplierModel> getSupplierById(String id) async {
    try {
      final response = await _apiService.dio.get(
        '${ApiConstants.suppliers}/$id',
      );
      return SupplierModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to fetch supplier: ${e.message}');
    }
  }

  Future<SupplierModel> createSupplier(CreateSupplierRequest request) async {
    try {
      final response = await _apiService.dio.post(
        ApiConstants.suppliers,
        data: request.toJson(),
      );
      return SupplierModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to create supplier: ${e.message}');
    }
  }

  Future<SupplierModel> updateSupplier(UpdateSupplierRequest request) async {
    try {
      final response = await _apiService.dio.put(
        '${ApiConstants.suppliers}/${request.id}',
        data: request.toJson(),
      );
      return SupplierModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to update supplier: ${e.message}');
    }
  }

  Future<void> deleteSupplier(String id) async {
    try {
      await _apiService.dio.delete('${ApiConstants.suppliers}/$id');
    } on DioException catch (e) {
      throw Exception('Failed to delete supplier: ${e.message}');
    }
  }
}
