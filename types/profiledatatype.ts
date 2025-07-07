export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  profileImage: string;
  role: "USER" | "ADMIN"; // Add more roles if needed
  otp: string | null;
  otpExpires: string | null;
  refreshToken: string;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  dob?: string | null;
};

export type UserResponse = {
  status: boolean;
  message: string;
  data: User;
};
