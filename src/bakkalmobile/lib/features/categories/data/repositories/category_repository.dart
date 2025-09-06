import 'package:dio/dio.dart';
import 'package:retrofit/retrofit.dart';
import '../../../../core/models/paginated_response.dart';
import '../models/category_model.dart';

part 'category_repository.g.dart';

@RestApi()
abstract class CategoryRepository {
  factory CategoryRepository(Dio dio, {String baseUrl}) = _CategoryRepository;

  @GET('/categories')
  Future<PaginatedResponse<CategoryModel>> getCategories({
    @Query('PageIndex') int pageIndex = 0,
    @Query('PageSize') int pageSize = 10,
  });

  @GET('/categories/{id}')
  Future<CategoryModel> getCategoryById(@Path('id') String id);

  @POST('/categories')
  Future<CategoryModel> createCategory(@Body() Map<String, dynamic> category);

  @PUT('/categories/{id}')
  Future<CategoryModel> updateCategory(
    @Path('id') String id,
    @Body() Map<String, dynamic> category,
  );

  @DELETE('/categories/{id}')
  Future<void> deleteCategory(@Path('id') String id);
}
