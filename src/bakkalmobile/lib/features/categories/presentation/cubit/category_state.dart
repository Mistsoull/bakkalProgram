import '../../data/models/category_model.dart';

abstract class CategoryState {
  const CategoryState();
}

class CategoryInitial extends CategoryState {}

class CategoryLoading extends CategoryState {}

class CategoryLoaded extends CategoryState {
  final List<CategoryModel> categories;
  final bool hasMore;
  final int currentPage;

  const CategoryLoaded({
    required this.categories,
    this.hasMore = false,
    this.currentPage = 0,
  });

  CategoryLoaded copyWith({
    List<CategoryModel>? categories,
    bool? hasMore,
    int? currentPage,
  }) {
    return CategoryLoaded(
      categories: categories ?? this.categories,
      hasMore: hasMore ?? this.hasMore,
      currentPage: currentPage ?? this.currentPage,
    );
  }
}

class CategoryError extends CategoryState {
  final String message;

  const CategoryError(this.message);
}

class CategoryDetailLoading extends CategoryState {}

class CategoryDetailLoaded extends CategoryState {
  final CategoryModel category;

  const CategoryDetailLoaded(this.category);
}

class CategoryDetailError extends CategoryState {
  final String message;

  const CategoryDetailError(this.message);
}

class CategoryCreating extends CategoryState {}

class CategoryCreated extends CategoryState {
  final CategoryModel category;

  const CategoryCreated(this.category);
}

class CategoryUpdating extends CategoryState {}

class CategoryUpdated extends CategoryState {
  final CategoryModel category;

  const CategoryUpdated(this.category);
}

class CategoryDeleting extends CategoryState {}

class CategoryDeleted extends CategoryState {
  final String categoryId;

  const CategoryDeleted(this.categoryId);
}
