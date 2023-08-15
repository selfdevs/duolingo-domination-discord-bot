import { AxiosError } from 'axios';

export function handleError(prefix: string, error: unknown) {
  if (error instanceof AxiosError) {
    console.error(prefix, 'Axios error, status:', error.response?.status);
  }
  if (error instanceof Error) {
    console.error(prefix, error.message);
  }
}
