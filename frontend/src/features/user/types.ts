export type UpdateUserRequest = {
  username?: string;
  displayName?: string;
  bio?: string;
};

export type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type DeleteUserRequest = {
  password: string;
};

export type UserResponse = {
  username: string;
  displayName?: string;
  bio?: string;
  imageUrl?: string;
};

export type User = UserResponse;
