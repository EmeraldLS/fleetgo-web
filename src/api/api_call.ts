import api from "../services/api";

export const getRequest = async (url: string) => {
  const resp = await api.get(url);
  return resp.data;
};

export const postRequest = async (path: string, data: unknown) => {
  const resp = await api.post(path, data);
  return resp.data;
};
