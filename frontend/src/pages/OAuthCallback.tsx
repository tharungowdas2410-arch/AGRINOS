import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    const complete = async () => {
      if (!accessToken || !refreshToken) {
        navigate("/login");
        return;
      }

      // Temporarily store tokens for API.me call
      const raw = localStorage.getItem("plant_classifier_session");
      const base = raw ? JSON.parse(raw) : {};
      base.tokens = { accessToken, refreshToken };
      localStorage.setItem("plant_classifier_session", JSON.stringify(base));

      try {
        const me = await api.me();
        const session = { user: me, tokens: { accessToken, refreshToken } };
        localStorage.setItem("plant_classifier_session", JSON.stringify(session));
        navigate("/dashboard", { replace: true });
      } catch {
        navigate("/login");
      }
    };

    void complete();
  }, [navigate, params]);

  return null;
};

export default OAuthCallback;
