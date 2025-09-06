import 'package:dio/dio.dart';
import '../../../../core/network/api_service.dart';
import '../../../../core/constants/api_constants.dart';
import '../../../../core/models/paginated_response.dart';
import '../models/on_credit_model.dart';

class OnCreditRepository {
  final ApiService _apiService;

  OnCreditRepository(this._apiService);

  Future<PaginatedResponse<OnCreditModel>> getOnCredits({
    int pageIndex = 0,
    int pageSize = 10,
  }) async {
    try {
      final response = await _apiService.dio.get(
        ApiConstants.onCredits,
        queryParameters: {'PageIndex': pageIndex, 'PageSize': pageSize},
      );

      return PaginatedResponse.fromJson(
        response.data,
        (json) => OnCreditModel.fromJson(json as Map<String, dynamic>),
      );
    } on DioException catch (e) {
      throw Exception('Failed to fetch on credits: ${e.message}');
    }
  }

  Future<OnCreditModel> getOnCreditById(String id) async {
    try {
      final response = await _apiService.dio.get(
        '${ApiConstants.onCredits}/$id',
      );
      return OnCreditModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to fetch on credit: ${e.message}');
    }
  }

  Future<OnCreditModel> createOnCredit(CreateOnCreditRequest request) async {
    try {
      final response = await _apiService.dio.post(
        ApiConstants.onCredits,
        data: request.toJson(),
      );
      return OnCreditModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to create on credit: ${e.message}');
    }
  }

  Future<OnCreditModel> updateOnCredit(UpdateOnCreditRequest request) async {
    try {
      final response = await _apiService.dio.put(
        '${ApiConstants.onCredits}/${request.id}',
        data: request.toJson(),
      );
      return OnCreditModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to update on credit: ${e.message}');
    }
  }

  Future<void> deleteOnCredit(String id) async {
    try {
      await _apiService.dio.delete('${ApiConstants.onCredits}/$id');
    } on DioException catch (e) {
      throw Exception('Failed to delete on credit: ${e.message}');
    }
  }

  Future<OnCreditModel> markAsPaid(String id) async {
    try {
      final response = await _apiService.dio.put(
        '${ApiConstants.onCredits}/$id/mark-as-paid',
      );
      return OnCreditModel.fromJson(response.data);
    } on DioException catch (e) {
      throw Exception('Failed to mark on credit as paid: ${e.message}');
    }
  }
}
