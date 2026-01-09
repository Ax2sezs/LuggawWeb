import { useState, useEffect, use } from "react";
import * as api from '../api/adminAPI';

function useAdmin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [userPage, setUserPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [userTotalPages, setUserTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [isActive, setIsActive] = useState(null)

    const [rewards, setRewards] = useState([]);
    const [rewardPage, setRewardPage] = useState(1);
    const [rewardTotalPages, setRewardTotalPages] = useState(1);
    const [rewardFilter, setRewardFilter] = useState('');
    const [isUsed, setIsUsed] = useState(null)

    const [feeds, setFeeds] = useState([]);
    const [feedPage, setFeedPage] = useState(1);
    const [feedTotalPages, setFeedTotalPages] = useState(1);
    const [feedFilter, setFeedFilter] = useState('');

    const [userReward, setUserReward] = useState([])
    const [userRewardPage, setUserRewardPage] = useState(1)
    const [userRewardTotalPages, setUserRewardTotalPages] = useState(1)
    const [userRewardFilter, setUserRewardFilter] = useState('')
    const [couponCode, setCouponCode] = useState('')
    const [total, setTotal] = useState()
    const [usedCount, setUsedCount] = useState()

    const [transaction, setTransaction] = useState([])
    const [transactionPage, setTransactionPage] = useState(1)
    const [transactionTotalPage, setTransactionTotalPage] = useState('')
    const [transactionFilter, setTransactionFilter] = useState({
        search: "",
        transactionType: "",
        rewardName: "",
        phoneNumber: "",
        startDate: "",
        endDate: "",
    });
    const [data, setData] = useState(null); // เก็บข้อมูล Dashboard
    const [cate, setCate] = useState([])
    const [genCode, setGenCode] = useState('')


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.getAllUsers({
                page: userPage,
                pageSize,
                searchTerm,
                isActive,
            });
            const data = res.data;
            setUsers(data.items ?? data);
            setUserTotalPages(Math.ceil(data.totalItems / pageSize) || 1);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, isActive) => {
        await api.toggleUserStatus(userId, isActive);
        fetchUsers();
    };

    const toggleUserPolicy = async (userId, isAllow) => {
        await api.toggleUserPolicy(userId, isAllow);
        fetchUsers();
    };


    const fetchRewards = async () => {
        setLoading(true);
        try {
            const res = await api.getAllRewards({
                page: rewardPage,
                pageSize,
                search: rewardFilter,
                isActive: isActive,
            });
            const data = res.data;
            setRewards(data.items ?? data);
            setRewardTotalPages(Math.ceil(data.totalItems / pageSize) || 1);
        } catch (err) {
            console.error("Failed to fetch rewards", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchRewardById = async (rewardId) => {
        try {
            const res = await api.getRewardById(rewardId);
            return res.data;
        } catch (err) {
            console.error("Failed to fetch reward by ID", err);
            throw err;
        }
    };

    // --- Toggle Reward Status ---
    const toggleRewardStatus = async (rewardId) => {
        setRewards((prev) => {
            const updatedRewards = prev.map((reward) => {
                if (reward.rewardId === rewardId) {
                    const newStatus = !reward.isActive;

                    // เรียก API ด้วยค่าที่คำนวณจาก state ปัจจุบัน
                    api.toggleRewardStatus(rewardId, newStatus).catch((err) => {
                        console.error("Toggle failed", err);
                    });

                    // อัปเดต state ทันที
                    return { ...reward, isActive: newStatus };
                }
                return reward;
            });

            return updatedRewards;
        });
    };




    // --- Create Reward ---
    const createReward = async (rewardData) => {
        try {
            await api.createReward(rewardData);
            fetchRewards();
        } catch (err) {
            console.error("Failed to create reward", err);
            throw err;
        }
    };

    // --- Update Reward ---
    const updateReward = async (rewardId, rewardData) => {
        try {
            await api.updateReward(rewardId, rewardData);
            fetchRewards();
        } catch (err) {
            console.error("Failed to update reward", err);
            throw err;
        }
    };

    const fetchFeeds = async () => {
        setLoading(true);
        try {
            const res = await api.getAllFeeds({
                pageNumber: feedPage,
                pageSize,
                search: feedFilter,      // ✅ แมปชื่อให้ตรง
                isActive: isActive,     // ✅ แมปชื่อให้ตรง
            });
            const data = res.data;
            setFeeds(data.items ?? data);
            setFeedTotalPages(Math.ceil(data.totalItems / pageSize) || 1);
        } catch (err) {
            console.error("Failed to fetch feeds", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeedById = async (feedId) => {
        try {
            const res = await api.getFeedById(feedId);
            return res.data;
        } catch (err) {
            console.error("Failed to fetch feed by ID", err);
            throw err;
        }
    };

    const createFeed = async (formData) => {
        try {
            await api.createFeed(formData);
            fetchFeeds();
        } catch (err) {
            console.error("Failed to create feed", err);
            throw err;
        }
    };

    const updateFeed = async (feedId, formData) => {
        setLoading(true)
        try {
            await api.updateFeed(feedId, formData);
            fetchFeeds();
        } catch (err) {
            console.error("Failed to update feed", err);
            throw err;
        } finally {
            setLoading(false)
        }
    };

    const deleteFeed = async (feedId) => {
        try {
            await api.deleteFeed(feedId);
            fetchFeeds();
        } catch (err) {
            console.error("Failed to delete feed", err);
        }
    };

    const toggleFeedStatus = async (feedId) => {
        try {
            await api.toggleFeedStatus(feedId);
            fetchFeeds();
        } catch (err) {
            console.error("Failed to toggle feed status", err);
        }
    };

    const deleteFeedImage = async (imageId) => {
        setLoading(true)
        try {
            await api.deleteFeedImage(imageId);
        } catch (err) {
            console.error("Failed to delete feed image", err);
        } finally {
            setLoading(false)
        }
    };

    const fetchTransaction = async () => {
        setLoading(true);
        try {
            const {
                search,
                transactionType,
                rewardName,
                phoneNumber,
                startDate,
                endDate,
            } = transactionFilter;

            const res = await api.alltransaction({
                page: transactionPage,
                pageSize,
                search,
                transactionType,
                rewardName,
                phoneNumber,
                startDate,
                endDate,
            });

            setTransaction(res.data.items);
            setTransactionTotalPage(Math.ceil(res.data.totalItems / pageSize));
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const res = await api.dashboard();
            setData(res.data);
        } catch (err) {
            console.error("Failed to fetch dashboard:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategory = async () => {
        setLoading(true)
        try {
            const res = await api.category()
            setCate(res.data)
        } catch (err) {
            console.error("Failed to fetch category", err)
            setError(err)
        } finally {
            setLoading(false)
        }
    }

    const fetchCategoryCode = async (prefix) => {
        setLoading(true);
        try {
            const res = await api.generateCode(prefix); // api.generateCode คือฟังก์ชันเรียก API generate-code?prefix=xxx
            return res.data.code; // สมมติ API คืน { code: "RD001" }
        } catch (err) {
            console.error("Failed to fetch category code", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loginAdmin = async (username, password) => {
        setLoading(true);
        try {
            const data = { username, password };
            const res = await api.loginAdmin(data);
            return res.data; // คาดว่าเป็น { token, userId, ... }
        } catch (err) {
            console.error("Login failed", err);
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };
    const fetchUserReward = async (rewardId, page, pageSize, filter, isUsed, couponCode) => {
        setLoading(true);
        try {
            const res = await api.userReward(rewardId, {
                page,
                pageSize,
                phoneNumber: filter,
                isUsed: isUsed,
                couponCode: couponCode,
            });

            setUserReward(res.data.paged.items); // ✅ ถูกต้อง
            setUserRewardTotalPages(Math.ceil(res.data.paged.totalItems / pageSize));
            setTotal(res.data.paged.totalItems)
            setUsedCount(res.data.usedCount);
        } catch (error) {
            console.error("Failed to fetch user rewards", error);
        } finally {
            setLoading(false);
        }
    };
    const revertStatus = async (code) => {
        try {
            setUserReward(prev => prev.map(item =>
                item.couponCode === code
                    ? { ...item, isUsed: !item.isUsed }
                    : item
            ));

            await api.revertCoupon(code);
            fetchUserReward(rewardId, userRewardPage, pageSize, userRewardFilter, isUsed, couponCode);
        } catch (err) {
            console.error("Failed to toggle feed status", err);
        }
    };











    // useEffect(() => {
    //     fetchUsers();
    // }, [userPage, pageSize, searchTerm, isActive]);

    // useEffect(() => {
    //     fetchRewards();
    // }, [rewardPage, pageSize, rewardFilter, isActive]);
    // useEffect(() => {
    //     fetchFeeds();
    // }, [feedPage, pageSize, feedFilter, isActive]);


    return {
        users,
        loading,
        userPage,
        setUserPage,
        pageSize,
        setPageSize,
        userTotalPages,
        searchTerm,
        setSearchTerm,
        setIsActive,
        toggleUserStatus,
        fetchUsers,
        isActive,

        rewards,
        rewardPage,
        setRewardPage,
        rewardTotalPages,
        rewardFilter,
        setRewardFilter,
        toggleRewardStatus,
        fetchRewards,
        createReward,
        updateReward,
        fetchRewardById,

        feeds,
        feedPage,
        setFeedPage,
        feedTotalPages,
        feedFilter,
        setFeedFilter,
        fetchFeeds,
        fetchFeedById,
        createFeed,
        updateFeed,
        deleteFeed,
        toggleFeedStatus,
        deleteFeedImage,

        transaction,
        loading,
        transactionPage,
        transactionTotalPage,
        setTransactionPage,
        transactionFilter,
        setTransactionFilter,
        fetchTransaction,

        data,
        fetchDashboard,
        fetchCategory,
        cate,
        fetchCategoryCode,

        loginAdmin,

        fetchUserReward,
        userReward,
        setUserRewardPage,
        userRewardPage,
        userRewardTotalPages,
        userRewardFilter,
        setUserRewardFilter,
        usedCount,
        total,
        setIsUsed,
        isUsed,
        couponCode,
        setCouponCode,
        revertStatus,
        toggleUserPolicy

    };
}

export default useAdmin;
