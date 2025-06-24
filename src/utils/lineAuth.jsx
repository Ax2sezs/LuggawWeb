const LINE_CHANNEL_ID = "2007420097";
// const REDIRECT_URI = "https://kaegoal.mmm2007.net/callback";

const REDIRECT_URI = import.meta.env.VITE_APP_REDIRECT_URI;
// const REDIRECT_URI = "http://172.20.10.5:5173/callback";


export const getLineLoginUrl = () => {
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
