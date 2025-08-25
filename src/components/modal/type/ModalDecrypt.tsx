import React, { useState } from "react";
import ModalComponent from "../../modal/ModalComponent";
import { EnPoint } from "../../../utils/EndPoint";
import { useForm } from "react-hook-form";

interface ModalDecryptProps {
  isOpen: boolean;
  onClose: () => void;
  detail: any;
}

type PinForm = {
  pin: string;
};

type SetPinForm = {
  newPin: string;
};

function usePinManagement(onClose?: () => void) {
  const [verifyPinLoading, setVerifyPinLoading] = useState(false);
  const [verifyPinError, setVerifyPinError] = useState("");
  const [verifyPinSuccess, setVerifyPinSuccess] = useState(false);

  const [setPinLoading, setSetPinLoading] = useState(false);
  const [setPinError, setSetPinError] = useState("");
  const [setPinSuccess, setSetPinSuccess] = useState(false);

  const resetAll = () => {
    setVerifyPinError("");
    setVerifyPinSuccess(false);
    setSetPinError("");
    setSetPinSuccess(false);
  };

  const handleVerifyPin = async (id: string, pin: string) => {
    setVerifyPinLoading(true);
    setVerifyPinError("");
    try {
      const res = await fetch(`${EnPoint}user/verify-pin/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok || !data?.data?.success) {
        throw new Error(data?.data?.message || "PIN salah");
      }
      setVerifyPinSuccess(true);
    } catch (err: any) {
      setVerifyPinError(err.message || "Gagal verifikasi PIN");
    } finally {
      setVerifyPinLoading(false);
    }
  };

  const handleSetPin = async (id: string, newPin: string) => {
    setSetPinLoading(true);
    setSetPinError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${EnPoint}user/set-pin/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ pin: newPin }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Gagal set PIN");
      }
      setSetPinSuccess(true);

      setTimeout(() => {
        setSetPinError("");
        setSetPinSuccess(false);
        setVerifyPinError("");
        setVerifyPinSuccess(false);
      }, 700);

      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch (err: any) {
      setSetPinError(err.message || "Gagal set PIN");
    } finally {
      setSetPinLoading(false);
    }
  };

  return {
    verifyPinLoading,
    verifyPinError,
    verifyPinSuccess,
    handleVerifyPin,
    setPinLoading,
    setPinError,
    setPinSuccess,
    handleSetPin,
    resetAll,
  };
}

const ModalDecryptView: React.FC<{
  detail: any;
  isEditPin: boolean;
  onEditPin: () => void;
  onCancelEditPin: () => void;
  verifyPinLoading: boolean;
  verifyPinError: string;
  verifyPinSuccess: boolean;
  onVerifyPin: (pin: string) => void;
  onCancel: () => void;

  setPinLoading: boolean;
  setPinError: string;
  setPinSuccess: boolean;
  onSetPin: (newPin: string) => void;
  onCancelSetPin: () => void;
}> = ({
  detail,
  isEditPin,
  onEditPin,
  onCancelEditPin,
  verifyPinLoading,
  verifyPinError,
  verifyPinSuccess,
  onVerifyPin,
  onCancel,

  setPinLoading,
  setPinError,
  setPinSuccess,
  onSetPin,
  onCancelSetPin,
}) => {
  // react-hook-form for verify pin
  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    reset: resetVerify,
    formState: { errors: verifyErrors },
  } = useForm<PinForm>();

  // react-hook-form for set pin
  const {
    register: registerSet,
    handleSubmit: handleSubmitSet,
    reset: resetSet,
    formState: { errors: setErrors },
  } = useForm<SetPinForm>();

  // Reset forms when needed
  React.useEffect(() => {
    if (!isEditPin) {
      resetVerify();
    }
    if (!isEditPin || !verifyPinSuccess) {
      resetSet();
    }
  }, [isEditPin, verifyPinSuccess, resetVerify, resetSet]);

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-700 w-28">Username:</span>
        <span className="text-gray-900">{detail?.username}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-700 w-28">Email:</span>
        <span className="text-gray-900">{detail?.email}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-700 w-28">Phone:</span>
        <span className="text-gray-900">{detail?.phone}</span>
      </div>
      <div className="flex items-center space-x-3">
        <span className="font-semibold text-gray-700 w-28">PIN:</span>
        <span className="text-gray-900">{detail?.pin}</span>
        {!isEditPin && (
          <button
            type="button"
            className="ml-2 px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
            onClick={onEditPin}
          >
            Ubah PIN
          </button>
        )}
        {isEditPin && (
          <button
            type="button"
            className="ml-2 px-2 py-1 text-xs bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onCancelEditPin}
          >
            Batal
          </button>
        )}
      </div>

      {/* Form 1: Verify PIN */}
      {isEditPin && (
        <div className="mt-4 border-t pt-4">
          <div className="font-semibold mb-2 text-gray-700">Verify PIN</div>
          <form
            className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0"
            onSubmit={handleSubmitVerify((data) => {
              onVerifyPin(data.pin);
            })}
          >
            <input
              type="number"
              className="border rounded px-2 py-1"
              placeholder="Input your PIN number"
              {...registerVerify("pin", {
                required: "PIN must be filled",
                pattern: {
                  value: /^\d{6}$/,
                  message: "PIN must be 6 digits",
                },
              })}
              disabled={verifyPinSuccess}
              maxLength={6}
              inputMode="numeric"
              autoComplete="one-time-code"
            />
            <button
              type="submit"
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
              disabled={verifyPinLoading || verifyPinSuccess}
            >
              {verifyPinLoading ? "Memeriksa..." : "Check PIN"}
            </button>
            <button
              type="button"
              onClick={() => {
                resetVerify();
                // Jangan resetSet di sini agar form 2 tidak ikut ter-reset
                onCancel();
              }}
              disabled={verifyPinLoading}
            >
              Reset
            </button>
            <div className="flex flex-col">
              {verifyErrors.pin && (
                <span className="text-red-500 text-xs">
                  {verifyErrors.pin.message}
                </span>
              )}
              {verifyPinError && (
                <span className="text-red-500 text-xs">{verifyPinError}</span>
              )}
              {verifyPinSuccess && (
                <span className="text-green-600 text-xs">PIN benar!</span>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Form 2: Set New PIN */}
      {isEditPin && verifyPinSuccess && (
        <>
          <div className="mt-4 border-t pt-4">
            <div className="font-semibold mb-2 text-gray-700">Set PIN Baru</div>
            <form
              className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0"
              onSubmit={handleSubmitSet((data) => {
                onSetPin(data.newPin);
              })}
            >
              <input
                type="number"
                className="border rounded px-2 py-1"
                placeholder="Input your new PIN"
                {...registerSet("newPin", {
                  required: "PIN must be filled",
                  pattern: {
                    value: /^\d{6}$/,
                    message: "PIN must be 6 digits",
                  },
                })}
                disabled={setPinSuccess}
                maxLength={6}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <button
                type="submit"
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={setPinLoading || setPinSuccess}
              >
                {setPinLoading ? "Menyimpan..." : "Set PIN Baru"}
              </button>
              <button
                type="button"
                onClick={() => {
                  resetSet();
                  // Jangan resetVerify di sini agar form 1 tidak ikut ter-reset
                  onCancelSetPin();
                }}
                disabled={setPinLoading}
              >
                Reset
              </button>
              <div className="flex flex-col">
                {setErrors.newPin && (
                  <span className="text-red-500 text-xs">
                    {setErrors.newPin.message}
                  </span>
                )}
                {setPinError && (
                  <span className="text-red-500 text-xs">{setPinError}</span>
                )}
                {setPinSuccess && (
                  <span className="text-green-600 text-xs">
                    PIN baru berhasil disimpan!
                  </span>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

const ModalDecrypt: React.FC<ModalDecryptProps> = ({
  isOpen,
  onClose,
  detail,
}) => {
  const [isEditPin, setIsEditPin] = useState(false);

  const {
    verifyPinLoading,
    verifyPinError,
    verifyPinSuccess,
    handleVerifyPin,
    setPinLoading,
    setPinError,
    setPinSuccess,
    handleSetPin,
    resetAll,
  } = usePinManagement(onClose);

  // Reset state when modal closed or cancel edit pin
  React.useEffect(() => {
    if (!isOpen) {
      setIsEditPin(false);
      resetAll();
    }
  }, [isOpen, resetAll]);

  const handleEditPin = () => {
    setIsEditPin(true);
    resetAll();
  };

  const handleCancelEditPin = () => {
    setIsEditPin(false);
    resetAll();
  };

  return (
    <div className="flex items-start justify-center min-h-screen pt-15">
      <ModalComponent
        isOpen={isOpen}
        onClose={onClose}
        title="Decrypted Detail"
        size="large"
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        {detail && (
          <ModalDecryptView
            detail={detail}
            isEditPin={isEditPin}
            onEditPin={handleEditPin}
            onCancelEditPin={handleCancelEditPin}
            verifyPinLoading={verifyPinLoading}
            verifyPinError={verifyPinError}
            verifyPinSuccess={verifyPinSuccess}
            onVerifyPin={(pin) => handleVerifyPin(detail?.id, pin)}
            onCancel={resetAll}
            setPinLoading={setPinLoading}
            setPinError={setPinError}
            setPinSuccess={setPinSuccess}
            onSetPin={(newPin) => handleSetPin(detail?.id, newPin)}
            onCancelSetPin={resetAll}
          />
        )}
      </ModalComponent>
    </div>
  );
};

export default ModalDecrypt;
