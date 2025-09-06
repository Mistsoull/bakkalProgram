import 'package:dio/dio.dart';
import '../../../../core/network/api_service.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/models/paginated_response.dart';
import '../models/customer_model.dart';

class CustomerRepository {
  final ApiService _apiService;

  CustomerRepository(this._apiService);

  Future<PaginatedResponse<CustomerModel>> getCustomers({
    int pageIndex = 0,
    int pageSize = 10,
  }) async {
    try {
      final response = await _apiService.dio.get(
        ApiConstants.customers,
        queryParameters: {'PageIndex': pageIndex, 'PageSize': pageSize},
      );

      return PaginatedResponse.fromJson(
        response.data,
        (json) => CustomerModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      throw Exception('Failed to fetch customers: ${e.message}');
    }
  }

  Future<CustomerModel> getCustomerById(String id) async {
    try {
      final response = await _apiService.dio.get(
        '${ApiConstants.customers}/$id',
      );
      return CustomerModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to fetch customer: ${e.message}');
    }
  }

  Future<CustomerModel> createCustomer(CreateCustomerRequest request) async {
    try {
      final response = await _apiService.dio.post(
        ApiConstants.customers,
        data: request.toJson(),
      );
      return CustomerModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to create customer: ${e.message}');
    }
  }

  Future<CustomerModel> updateCustomer(UpdateCustomerRequest request) async {
    try {
      final response = await _apiService.dio.put(
        '${ApiConstants.customers}/${request.id}',
        data: request.toJson(),
      );
      return CustomerModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to update customer: ${e.message}');
    }
  }

  Future<void> deleteCustomer(String id) async {
    try {
      await _apiService.dio.delete('${ApiConstants.customers}/$id');
    } on DioException catch (e) {
      throw Exception('Failed to delete customer: ${e.message}');
    }
  }
}
