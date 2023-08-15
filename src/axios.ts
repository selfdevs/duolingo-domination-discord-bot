import { AxiosError } from 'axios';

export function handleAxiosError(error: unknown) {
  if (error instanceof AxiosError) {
    console.log('Axios error, status:', error.response?.status);
  }
}
