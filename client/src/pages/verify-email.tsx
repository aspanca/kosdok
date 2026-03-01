import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../context/auth-context";

export const VerifyEmailPage = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const token = new URLSearchParams(window.location.search).get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Linku i verifikimit nuk është valid.");
      return;
    }

    verifyEmail(token)
      .then(() => {
        setStatus("success");
        setTimeout(() => navigate({ to: "/" }), 2000);
      })
      .catch((err) => {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Verifikimi dështoi.");
      });
  }, [token, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-[#f8f8f8] flex items-center justify-center px-4">
      <div className="bg-white border border-[#dedede] shadow-sm rounded-xl p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6" />
            <h1 className="text-xl font-bold text-[#494e60] mb-2">Duke verifikuar...</h1>
            <p className="text-[#9fa4b4]">Ju lutemi prisni</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#494e60] mb-2">Email-i u verifikua!</h1>
            <p className="text-[#9fa4b4] mb-4">Po ju ridrejtojmë...</p>
            <Link to="/" className="text-primary font-[600] hover:underline">
              Shko në faqen kryesore
            </Link>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-[#494e60] mb-2">Verifikimi dështoi</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <Link to="/signup" className="text-primary font-[600] hover:underline">
              Regjistrohu përsëri
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
