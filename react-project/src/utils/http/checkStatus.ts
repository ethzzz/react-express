import type { ErrorMessageMode } from '#/axios';
import { useMessage } from '@/hooks/web/useMessage';
// import { useI18n } from '@/hooks/web/useI18n';
// import router from '@/router';
// import { PageEnum } from '@/enums/pageEnum';
import useUserStore from '@/store/modules/user';
// import projectSetting from '@/settings/projectSetting';
// import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';

const { createMessage, createErrorModal } = useMessage();
const error = createMessage.error!;
// const stp =  projectSetting.sessionTimeoutProcessing;

export function checkStatus(
  status: number,
  msg: string,
  errorMessageMode: ErrorMessageMode = 'message',
): void {
  const userStore = useUserStore.getState();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: Not logged in
    // Jump to the login page if not logged in, and carry the path of the current page
    // Return to the current page after successful login. This step needs to be operated on the login page.
    case 401:
      userStore.setToken(undefined);
      // errMessage = msg || 'sys.api.errMsg401';
      userStore.logout(false);
      break;
    case 403:
      errMessage = 'sys.api.errMsg403';
      break;
    // 404请求不存在
    case 404:
      errMessage = 'sys.api.errMsg404';
      break;
    case 405:
      errMessage = 'sys.api.errMsg405';
      break;
    case 408:
      errMessage = 'sys.api.errMsg408';
      break;
    case 500:
      errMessage = 'sys.api.errMsg500';
      break;
    case 501:
      errMessage = 'sys.api.errMsg501';
      break;
    case 502:
      errMessage = 'sys.api.errMsg502';
      break;
    case 503:
      errMessage = 'sys.api.errMsg503';
      break;
    case 504:
      errMessage = 'sys.api.errMsg504';
      break;
    case 505:
      errMessage = 'sys.api.errMsg505';
      break;
    default:
  }

  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createErrorModal({ title: 'sys.api.errorTip', content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({ content: errMessage, key: `global_error_message_status_${status}` });
    }
  }
}
