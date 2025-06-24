import api from "./api";

export const getRedeemedRewardByUserId = (status="all",page = 1,pageSize= 20) => {
  return api.get(`/Redeem/redeemed-rewards`,{
    params:{status,page,pageSize}
  });
};

export const getAllRewards = () => api.get("/Reward");

export const redeemReward = ({ rewardId }) =>
  api.post("/Redeem/redeem", { rewardId });

export const getAvailableRewards = (userId) =>
  api.get(`/Reward/available/${userId}`);


