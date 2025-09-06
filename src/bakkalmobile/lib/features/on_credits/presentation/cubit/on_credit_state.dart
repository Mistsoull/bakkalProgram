part of 'on_credit_cubit.dart';

abstract class OnCreditState {}

class OnCreditInitial extends OnCreditState {}

class OnCreditLoading extends OnCreditState {}

class OnCreditLoaded extends OnCreditState {
  final PaginatedResponse<OnCreditModel> paginatedOnCredits;

  OnCreditLoaded(this.paginatedOnCredits);

  List<OnCreditModel> get onCredits => paginatedOnCredits.items;
}

class OnCreditDetailLoaded extends OnCreditState {
  final OnCreditModel onCredit;

  OnCreditDetailLoaded(this.onCredit);
}

class OnCreditCreated extends OnCreditState {}

class OnCreditUpdated extends OnCreditState {}

class OnCreditDeleted extends OnCreditState {}

class OnCreditMarkedAsPaid extends OnCreditState {}

class OnCreditError extends OnCreditState {
  final String message;

  OnCreditError(this.message);
}
