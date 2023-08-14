import { AxiosError } from 'axios';

export function handleAxiosError(error: unknown) {
  console.log(error);
  if (error instanceof AxiosError) {
    console.log(error.response?.status);
    console.log(error.response?.data);
  }
}
