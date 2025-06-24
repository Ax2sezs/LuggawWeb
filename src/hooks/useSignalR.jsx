import { useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

export default function useSignalR(onCouponUsed, enabled = true) {
  const connectionRef = useRef(null);

  useEffect(() => {
    if (!enabled) {
      // ถ้าไม่ได้เปิด ให้ disconnect และไม่สร้าง connection ใหม่
      if (connectionRef.current) {
        connectionRef.current.off("CouponUsed");
        connectionRef.current.stop();
        connectionRef.current = null;
        console.log("SignalR disconnected because enabled=false");
      }
      return;
    }

    const token = localStorage.getItem("jwtToken");

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_APP_SIGNALR, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("✅ Connected to SignalR");

        connection.on("CouponUsed", (couponCode) => {
          console.log("🔔 CouponUsed event received:", couponCode);
          onCouponUsed?.(couponCode);
        });
      } catch (err) {
        console.error("❌ SignalR connect failed", err);
      }
    };

    startConnection();

    return () => {
      console.log("Disconnecting SignalR");
      if (connectionRef.current) {
        connectionRef.current.off("CouponUsed");
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [onCouponUsed, enabled]);
}
