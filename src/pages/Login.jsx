// src/pages/Login.jsx
import React from "react";
import LoginButton from "../components/LoginButton";

const LINE_CHANNEL_ID = import.meta.env.VITE_APP_LINE_CHANNEL_ID;;
// const REDIRECT_URI = "https://kaegoal.mmm2007.net/callback";

const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI;
// const REDIRECT_URI = "http://172.20.10.5:5173/callback";


const getLineLoginUrl = () => {
    const baseUrl = "https://access.line.me/oauth2/v2.1/authorize";
    const params = new URLSearchParams({
        response_type: "code",
        client_id: LINE_CHANNEL_ID,
        redirect_uri: REDIRECT_URI,
        state: "random_state_1234",
        scope: "profile openid",
        nonce: "random_nonce_1234",
    });
    return `${baseUrl}?${params.toString()}`;
};

export default function Login() {
    return (
            <div className="flex flex-col items-center">
                <h1 className="text-xl font-bold mb-4 text-main-green">เข้าสู่ระบบด้วย LINE</h1>
                <LoginButton loginUrl={getLineLoginUrl()} />
            </div>
    );
}
