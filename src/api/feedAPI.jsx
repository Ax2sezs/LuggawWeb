import api from "./api";

export const getUserFeed = (page = 1, pageSize = 5) => {
  return api.get('/feeds/GetUserFeed', {
    params: { page, pageSize }
  });
};

export const toggleLike = (feedId) => {
  return api.patch("/feeds/toggle", { feedId });
};


