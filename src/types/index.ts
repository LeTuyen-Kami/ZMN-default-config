export interface ListResponseProps<T> {
  data: {
    numOfRecords: number | null;
    numOfPages: number | null;
    pageIndex: number | null;
    data: T[];
  };
}

interface SortProps {
  fieldName: string | null;
  ascending: boolean;
}
export interface ListRequestProps {
  pageIndex: number | null;
  pageSize: number | null;
  sortBy?: SortProps[];
}

export interface ResponseProps<T> {
  data: T;
  isSuccess: boolean;
  messages: {
    content: string;
    type: number;
  }[];
}
