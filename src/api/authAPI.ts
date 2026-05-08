import { apiRequest } from "./operators";
import { authCookies } from "./cookies";
import type { ApiEnvelope, AuthPayload } from "./types";

export interface RegisterInput {
  name: string;
  email: string;
  phone_code?: string;
  phone_number?: string;
  password: string;
  password_confirmation: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

type LoginApiResponse = {
  status: string;
  message?: string;
  token?: string;
  user?: AuthPayload["user"];
  data?: {
    access_token?: string;
    user?: AuthPayload["user"];
  };
};

export interface ResetPasswordInput {
  email: string;
  reset_code: string;
  password: string;
  password_confirmation: string;
}

export interface UserDetailsResponse {
  status: string;
  data: {
    user: AuthPayload["user"];
  };
}

export interface UpdateProfileInput {
  name: string;
  username: string;
  phone: string;
}

const toFormData = <T extends object>(payload: T) => {
  const formData = new FormData();
  Object.entries(payload as Record<string, unknown>).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  });
  return formData;
};

export const authAPI = {
  register: (payload: RegisterInput) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/register",
      method: "POST",
      data: toFormData(payload),
    }),

  login: async (payload: LoginInput) => {
    const response = await apiRequest<LoginApiResponse>({
      url: "/login",
      method: "POST",
      data: toFormData(payload),
    });

    const token = response.token ?? response.data?.access_token ?? null;
    const user = response.user ?? response.data?.user ?? null;

    if (!token || !user) {
      throw new Error("Login response is missing auth credentials.");
    }

    authCookies.setToken(token);
    authCookies.setUser(user);

    return {
      status: response.status,
      message: response.message ?? "Login successful.",
      token,
      user,
    } as AuthPayload;
  },

  verifyEmail: (email: string, verification_code: string) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/email/verify",
      method: "POST",
      data: toFormData({ email, verification_code }),
    }),

  resendVerification: (email: string) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/email/send",
      method: "POST",
      data: toFormData({ email }),
    }),

  forgotPassword: (email: string) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/password/forgot",
      method: "POST",
      data: toFormData({ email }),
    }),

  verifyResetCode: (email: string, reset_code: string) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/password/reset/code/verify",
      method: "POST",
      data: toFormData({ email, reset_code }),
    }),

  resetPassword: (payload: ResetPasswordInput) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/password/reset",
      method: "POST",
      data: toFormData(payload),
    }),

  getDetails: () =>
    apiRequest<UserDetailsResponse>({
      url: "/details",
      method: "GET",
    }),

  updateProfileDetails: (payload: UpdateProfileInput) =>
    apiRequest<ApiEnvelope<unknown>>({
      url: "/profile/details/update",
      method: "POST",
      data: toFormData(payload),
    }),

  getGoogleUrl: () =>
    apiRequest<{ status: string; url: string }>({
      url: "/auth/google",
      method: "GET",
    }),

  getAppleUrl: () =>
    apiRequest<{ status: string; url: string }>({
      url: "/auth/apple",
      method: "GET",
    }),

  authenticateGoogle: (google_access_token: string, google_id: string) =>
    apiRequest<AuthPayload>({
      url: "/authenticate/google",
      method: "POST",
      data: toFormData({ google_access_token, google_id }),
    }),

  authenticateApple: (apple_id_token: string) =>
    apiRequest<AuthPayload>({
      url: "/authenticate/apple",
      method: "POST",
      data: toFormData({ apple_id_token }),
    }),

  logout: async () => {
    try {
      await apiRequest<ApiEnvelope<unknown>>({
        url: "/logout",
        method: "POST",
      });
    } catch {
      // Preserve UX: clear local auth state even if backend logout fails.
    }
    authCookies.clearAll();
  },
};
