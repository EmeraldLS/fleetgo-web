import api from "./api";

export const RegisterUser = async (user: UserRegistaration) => {
  const response = await api.post("users/users/", user);

  if (response.data.status_code != 201) {
    throw new Error(response.data.message);
  }

  return response.data;
};

export const LoginUser = async (values: {
  email: string;
  password: string;
}) => {
  const response = await api.post("/login", values);

  return response.data as LoginReturnType;
};
