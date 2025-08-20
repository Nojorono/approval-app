import { useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../API/store/AuthStore/authStore";

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

    const handleSubmit = (enteredPin: string) => {

        setIsLoading(true);
        setError(null);
        fetch(`http://10.0.29.47:9007/user/verify-pin/${approverId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pin: enteredPin }),
        })
            .then(async (res) => {
                setIsLoading(false);
                const data = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(data?.message || "PIN verification failed");
                }
                console.log("Token",data.data.token);
                
                const accessToken = data.data.token;
                // Simpan ke localStorage
                localStorage.setItem(
                    "user_login_data",
                    JSON.stringify({ accessToken})
                );
                localStorage.setItem("token", accessToken);
                // Kirim data ke halaman berikutnya via state
                setTimeout(() => {
                    navigate("/Approval-Process/detail", { state: { id } });
                }, 800);
            })
            .catch((err) => {
                setIsLoading(false);
                setError(err.message || "PIN verification failed");
                alert("PIN tidak valid, silahkan coba lagi");
            });
    };

    return (
        <div>
            <h1>Approval Page</h1>
            <p><strong>ID:</strong> {id}</p>
            <p><strong>Approver ID:</strong> {approverId}</p>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 32 }}>
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
                            onChange={e => {
                                const value = e.target.value.replace(/[^0-9]/g, "");
                                if (!value) return;
                                // Update pin state
                                const newPin = [...pin];
                                newPin[idx] = value;
                                setPin(newPin);

                                // Fokus ke input berikutnya jika belum di akhir
                                if (idx < 5) {
                                    pinRefs.current[idx + 1]?.focus();
                                }

                                // Jalankan submit jika sudah 6 digit (semua terisi)
                                if (idx === 5 && value && [...newPin].every(d => d)) {
                                    // Pastikan state terbaru digunakan
                                    handleSubmit(newPin.join(""));
                                }
                            }}
                            onKeyDown={e => handlePinKeyDown(e, idx)}
                            ref={el => { pinRefs.current[idx] = el; }}
                        />
                    ))}    </div>
            </div>
        </div>
    );
}
