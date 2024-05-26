export interface PageResponse<T> {
  content: T;
  total_pages: number;
  page: number | null;
  size: number | null;
  first: boolean;
  last: boolean;
}
