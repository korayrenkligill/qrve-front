export interface ApiResponseType<T> {
  isSuccess: boolean;
  message: string | null;
  statusCode: number;
  data: T | null;
}
