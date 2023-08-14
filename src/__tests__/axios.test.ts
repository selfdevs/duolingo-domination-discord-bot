import { AxiosError, AxiosHeaders } from 'axios';
import { handleAxiosError } from '../axios';

describe('handleAxiosError', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log the response status and data when the error is an instance of AxiosError', () => {
    const error = new AxiosError('not found', '404', undefined, null, {
      status: 404,
      data: 'Not Found',
      statusText: 'Not Found',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    });
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleAxiosError(error);
    expect(consoleSpy).toHaveBeenCalledWith(404);
    expect(consoleSpy).toHaveBeenCalledWith('Not Found');
  });

  it('should not log anything when the error is not an instance of AxiosError', () => {
    const error = new Error('not found');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    handleAxiosError(error);
    expect(consoleSpy).not.toHaveBeenCalled();
  });
});
