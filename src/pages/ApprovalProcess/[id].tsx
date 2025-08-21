import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ActIndicator from "../../components/ui/activityIndicator";
import { EnPoint } from "../../utils/EndPoint";


export const ApprovalProcess: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Route param
    const [searchParams] = useSearchParams(); // Query params
    const approverId = searchParams.get("approverId");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // PIN state and refs
    const [pin, setPin] = useState<string[]>(Array(6).fill(""));
    const pinRefs = useRef<Array<HTMLInputElement | null>>([]);


    const handlePinKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            if (pin[idx]) {
                const newPin = [...pin];
                newPin[idx] = "";
                setPin(newPin);
            } else if (idx > 0) {
                pinRefs.current[idx - 1]?.focus();
            }
        }
    };

    const handleSubmit = async (enteredPin: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${EnPoint}/user/verify-pin/${approverId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pin: enteredPin }),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(data?.message || "PIN verification failed");
            }

            const accessToken = data?.data?.token;
            if (!accessToken) {
                throw new Error("Token not found in response");
            }

            localStorage.setItem("user_login_data", JSON.stringify({ accessToken }));
            localStorage.setItem("token", accessToken);

            setTimeout(() => {
                setIsLoading(false);
                navigate("/Approval-Process/detail", { state: { id, approverId } });
            }, 800);
        } catch (err: any) {
            setIsLoading(false);
            setError(err?.message || "PIN verification failed");
            alert("PIN tidak valid, silahkan coba lagi");
        }
    };
    if (isLoading) return (  
    <div className="flex items-center justify-center min-h-screen">
      <ActIndicator />
    </div>);
    return (
        <div
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "16px", // memberi ruang saat di mobile
    boxSizing: "border-box",
  }}
>
  {/* Logo */}
  <img
    src="https://nna-app-s3.s3.ap-southeast-3.amazonaws.com/kcsi/logo-kcsi"
    alt="Logo"
    style={{ width: 200, height: 140, marginBottom: 24 }}
  />

  {/* PIN Input */}
  <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
    {[...Array(6)].map((_, idx) => (
      <input
        key={idx}
        type="password"
        inputMode="numeric"
        maxLength={1}
        pattern="[0-9]*"
        style={{
          width: 40,
          height: 48,
          fontSize: 24,
          textAlign: "center",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
        value={pin[idx] || ""}
        onChange={(e) => {
          const value = e.target.value.replace(/[^0-9]/g, "");
          if (!value) return;

          const newPin = [...pin];
          newPin[idx] = value;
          setPin(newPin);

          if (idx < 5) {
            pinRefs.current[idx + 1]?.focus();
          }

          if (idx === 5 && value && [...newPin].every((d) => d)) {
            handleSubmit(newPin.join(""));
          }
        }}
        onKeyDown={(e) => handlePinKeyDown(e, idx)}
        ref={(el) => {
          pinRefs.current[idx] = el;
        }}
      />
    ))}
  </div>
</div>

    );
}
