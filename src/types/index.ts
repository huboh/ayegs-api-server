export const enum ResponseStatus {
  success = 'success',
  error = 'error'
}

export interface SendJsonProps {
  status: 'success' | 'error';
  statusCode: number;
  message?: string;
  data?: object;
}
