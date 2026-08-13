export type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
