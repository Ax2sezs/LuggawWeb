// adminApi.js
import api from "./api";

export const getAllUsers = (params) =>
    api.get("/admin/all-user", { params });

export const toggleUserStatus = (userId, isActive) =>
    api.patch("/admin/toggle-user-status", { userId, isActive });

export const createReward = (formData) =>
    api.post("/admin/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const updateReward = (rewardId, formData) =>
    api.put(`/admin/update-reward/${rewardId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });


export const toggleRewardStatus = (rewardId) =>
    api.patch(`/admin/rewards/${rewardId}/toggle-active`);



export const getAllRewards = (params) =>
    api.get("/admin/rewards", { params }); // รองรับ filter, pagination

export const getRewardById = (rewardId) =>
    api.get(`/admin/reward/${rewardId}`, rewardId)

// 📌 Feed CRUD
export const getAllFeeds = (params) =>
    api.get("/admin/get-all-feed", { params }); // รองรับ pagination, filter

export const getFeedById = (feedId) =>
    api.get(`/admin/get-feed-by/${feedId}`);

export const createFeed = (formData) =>
    api.post("/admin/create-feed", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const updateFeed = (feedId, formData) =>
    api.put(`/admin/update-feed/${feedId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });

export const toggleFeedStatus = (feedId) =>
    api.patch(`/admin/${feedId}/toggle-active`);

export const deleteFeedImage = (imageId) =>
    api.delete(`/admin/images/${imageId}`);

export const alltransaction = (params) =>
    api.get("/admin/get-all-transaction", { params })

export const dashboard = () =>
    api.get("/admin/summary");

export const category = () =>
    api.get("/admin/get-category")

export const generateCode = (prefix) =>
    api.get(`/admin/generate-code?prefix=${prefix}`);
