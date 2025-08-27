// Modal.tsx
import React from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>
          ✕
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

const styles = {
    backdrop: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        margin: 10,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        padding: '40px 32px 32px 32px', // lebih besar, atas lebih besar untuk button
        borderRadius: '8px',
        minWidth: '600px', // lebih lebar
        maxWidth: '95%',
        maxHeight: '85vh',
        overflowY: 'auto' as const,
        position: 'relative' as const,
    },
    closeButton: {
        position: 'absolute' as const,
        top: '10px', // lebih jauh dari atas
        right: '10px', // lebih jauh dari kanan
        background: 'transparent',
        border: 'none',
        fontSize: '22px', // lebih besar
        cursor: 'pointer',
        zIndex: 1,
    },
};

export default Modal;
