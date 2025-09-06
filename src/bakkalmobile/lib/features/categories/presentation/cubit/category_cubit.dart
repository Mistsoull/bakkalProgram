import 'package:flutter_bloc/flutter_bloc.dart';
import '../../data/repositories/category_repository.dart';
import 'category_state.dart';

class CategoryCubit extends Cubit<CategoryState> {
  final CategoryRepository _repository;

  CategoryCubit(this._repository) : super(CategoryInitial());

  Future<void> getCategories({int pageIndex = 0, int pageSize = 10}) async {
    try {
      emit(CategoryLoading());
      final response = await _repository.getCategories(
        pageIndex: pageIndex,
        pageSize: pageSize,
      );
      emit(
        CategoryLoaded(
          categories: response.items,
          hasMore: response.hasNext,
          currentPage: response.index,
        ),
      );
    } catch (e) {
      emit(
        CategoryError('Kategoriler yüklenirken hata oluştu: ${e.toString()}'),
      );
    }
  }

  Future<void> getCategoryById(String id) async {
    try {
      emit(CategoryDetailLoading());
      final category = await _repository.getCategoryById(id);
      emit(CategoryDetailLoaded(category));
    } catch (e) {
      emit(
        CategoryDetailError(
          'Kategori detayı yüklenirken hata oluştu: ${e.toString()}',
        ),
      );
    }
  }

  Future<void> createCategory({required String name}) async {
    try {
      emit(CategoryCreating());
      final categoryData = {'name': name};
      final category = await _repository.createCategory(categoryData);
      emit(CategoryCreated(category));
      // Refresh the list
      getCategories();
    } catch (e) {
      emit(
        CategoryError('Kategori oluşturulurken hata oluştu: ${e.toString()}'),
      );
    }
  }

  Future<void> updateCategory({
    required String id,
    required String name,
  }) async {
    try {
      emit(CategoryUpdating());
      final categoryData = {'id': id, 'name': name};
      final category = await _repository.updateCategory(id, categoryData);
      emit(CategoryUpdated(category));
      // Refresh the list
      getCategories();
    } catch (e) {
      emit(
        CategoryError('Kategori güncellenirken hata oluştu: ${e.toString()}'),
      );
    }
  }

  Future<void> deleteCategory(String id) async {
    try {
      emit(CategoryDeleting());
      await _repository.deleteCategory(id);
      emit(CategoryDeleted(id));
      // Refresh the list
      getCategories();
    } catch (e) {
      emit(CategoryError('Kategori silinirken hata oluştu: ${e.toString()}'));
    }
  }

  void resetToInitial() {
    emit(CategoryInitial());
  }
}
