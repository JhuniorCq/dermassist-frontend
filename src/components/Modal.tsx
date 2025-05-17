import { IoClose } from "react-icons/io5";

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
};

// Conectar el modal para introducir la info traida de Gemini AI
const Modal = ({ isOpen, close, children }: ModalProps) => {
  if (!isOpen) return;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 cursor-pointer"
      onClick={close}
    >
      <div
        className="w-full max-h-[calc(100%-6rem)] overflow-y-auto bg-white rounded-xl p-8 max-w-2xl shadow-lg relative cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        <IoClose
          className="absolute text-xl top-4 right-4 transition-colors duration-300 ease-in-out text-primary-hard hover:text-primary-hard-hover cursor-pointer"
          onClick={close}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
