import { productsApi } from "@/core/api/productsApi";
import { User } from "../interface/user";

export const getProfile = async (): Promise<User> => {
  try {
    const { data } = await productsApi.get<{ user: User }>("/auth/profile");
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching profile");
  }
};

export const updateProfile = async (profileData: Partial<User>): Promise<User> => {
  try {
    const { data } = await productsApi.patch<{ user: User }>("/auth/profile", profileData);
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating profile");
  }
};

export const updateProfileImage = async (imageUrl: string): Promise<User> => {
  try {
    const { data } = await productsApi.patch<{ user: User }>("/auth/profile/image", { imageUrl });
    return data.user;
  } catch (error) {
    console.log(error);
    throw new Error("Error updating profile image");
  }
};
