// src/hooks/useTransaction.jsx
import { useState, useEffect } from "react";
import { getTransaction } from "../api/transactionAPI";

export function useTransaction(phoneNumber, initialPageSize = 5) {
  const [transactions, setTransactions] = useState([]);
  const [userId, setUserId] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(initialPageSize);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async (page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTransaction(phoneNumber, page, pageSize);
      setTransactions(res.data.transactions);
      setUserId(res.data.userId);
      setTotalPoints(res.data.totalPoints);
      setPageNumber(res.data.pageNumber);
      setTotalTransactions(res.data.totalTransactions);
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchTransactions(pageNumber);
    }
  }, [phoneNumber, pageNumber]);

  const handlePrev = () => {
    if (pageNumber > 1) setPageNumber((p) => p - 1);
  };

  const handleNext = () => {
    if (pageNumber * pageSize < totalTransactions) setPageNumber((p) => p + 1);
  };

  return {
    transactions,
    userId,
    totalPoints,
    pageNumber,
    pageSize,
    totalTransactions,
    loading,
    error,
    handlePrev,
    handleNext,
  };
}
