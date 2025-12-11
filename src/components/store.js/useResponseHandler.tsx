import { SUCCESS_RESPONSE_CODE } from '@/helper-function/pageUtils';
import { useDialog } from '@/provider/DialogProvider';

export interface ApiResponse {
  responseCode?: string;
  message?: string;
}

interface HandleApiResponseOptions {
  response: ApiResponse;
  onSuccess?: () => void;
  onError?: () => void;
  showSuccessMessage?: boolean;
}

export const useResponseHandler = () => {
  const { handleResponse } = useDialog();

  const handleApiResponse = ({ response, onSuccess, onError, showSuccessMessage = false }: HandleApiResponseOptions): void => {
    const { responseCode: code } = response ?? {};
    const { message } = response?.data ?? '';
    const msg = message || 'Invalid Response';
    console.log(response);
    if (code === SUCCESS_RESPONSE_CODE) {
      onSuccess?.();
      if (showSuccessMessage) handleResponse(msg, false);
    } else {
      onError?.();
      const { errors } = response;
      const errMsg = errors[0]?.message;
      handleResponse(errMsg, true);
    }
  };

  return { handleApiResponse };
};
