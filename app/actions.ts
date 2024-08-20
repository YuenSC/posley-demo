"use server";

export const createTransaction = (
  previousError: string | undefined,
  formData: FormData
) => {
  try {
    // await signIn("credentials", formData);
  } catch (error: any) {
    return error.message;
  }
};
