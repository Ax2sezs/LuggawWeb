import api from "./api";

export const getTransaction = (phoneNumber, pageNumber, pageSize) => {
  return api.get("/Points/transactions", {
    params: { phoneNumber, pageNumber, pageSize },
  });
};
