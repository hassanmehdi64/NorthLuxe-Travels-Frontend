export const getApiErrorMessage = (error, fallback = "Something went wrong.") => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData.trim();
  }

  if (responseData?.message && typeof responseData.message === "string") {
    return responseData.message;
  }

  if (Array.isArray(responseData?.errors) && responseData.errors.length) {
    const firstError = responseData.errors[0];
    if (typeof firstError === "string" && firstError.trim()) {
      return firstError.trim();
    }
    if (firstError?.message && typeof firstError.message === "string") {
      return firstError.message;
    }
  }

  if (error?.message && typeof error.message === "string") {
    return error.message;
  }

  return fallback;
};
