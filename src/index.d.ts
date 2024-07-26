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

interface Trip {
  type: string;
  driver_id: number;
  id: string;
  status: string;
  date_time: string;
  pickup_location_coord: {
    lat: number;
    lng: number;
  };
  dropoff_location_coord: {
    lat: number;
    lng: number;
  };
}
