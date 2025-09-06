import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../../../../core/models/paginated_response.dart';
import '../models/order_model.dart';

part 'order_repository.g.dart';

@RestApi()
abstract class OrderRepository {
  factory OrderRepository(Dio dio, {String baseUrl}) = _OrderRepository;

  @GET('/orders')
  Future<PaginatedResponse<OrderModel>> getOrders({
    @Query('PageIndex') int pageIndex = 0,
    @Query('PageSize') int pageSize = 10,
  });

  @GET('/orders/{id}')
  Future<OrderModel> getOrderById(@Path('id') String id);

  @POST('/orders')
  Future<OrderModel> createOrder(@Body() Map<String, dynamic> order);

  @PUT('/orders/{id}')
  Future<OrderModel> updateOrder(
    @Path('id') String id,
    @Body() Map<String, dynamic> order,
  );

  @DELETE('/orders/{id}')
  Future<void> deleteOrder(@Path('id') String id);

  @PUT('/orders/{id}/deliver')
  Future<OrderModel> markAsDelivered(@Path('id') String id);

  @PUT('/orders/{id}/pay')
  Future<OrderModel> markAsPaid(@Path('id') String id);
}
