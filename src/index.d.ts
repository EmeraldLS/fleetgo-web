type UserRegistaration = {
  name: string;
  email: string;
  password: string;
  shipping_address: string;
  phone: string;
};

interface LoginReturnType {
  MESSAGE: string;
  STATUS: string;
  DATA: User;
}

interface User {
  full_name: string;
  email: string;
  token: string;
  refresh_token: string;
  user_type: number;
}
