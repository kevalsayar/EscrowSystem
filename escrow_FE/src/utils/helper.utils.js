import { toast } from "react-toastify";
import { ERROR_CODES, TOAST_RESPONSE } from "../utils/constants.utils";

/**
 * Helper function to show toasts.
 * @param {String} message message to display in the toast.
 * @param {String} toastId unique toastId for each toast.
 * @param {String} response receives success or error and displays message accordingly.
 */
export const toastMessage = (message, toastId, response) => {
  !toast.isActive(toastId) &&
    toast[response](message, {
      toastId: toastId,
    });
};

/**
 * Helper function to check the error thrown.
 * @param {Object} error contains details of the error thrown.
 */
export const checkError = (error) => {
  if (error.code === ERROR_CODES.USER_REJECTED_REQUEST) {
    toastMessage(error.message, "toast_denied_error", TOAST_RESPONSE.ERROR);
  } else if (error.code === ERROR_CODES.RESOURCE_BUSY) {
    toastMessage(error.message, "toast_resource_error", TOAST_RESPONSE.ERROR);
  } else if (error.code === ERROR_CODES.TRANSACTION_REJECTED) {
    toastMessage(error.message, "toast_resource_error", TOAST_RESPONSE.ERROR);
  }
};
