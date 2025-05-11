import { ArrowLeftOutlined, CloseOutlined } from "@ant-design/icons";
import React, { useRef, useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  description: string;
  children: React.ReactNode;
  onBack: () => void;
}


const PostFromFacebook: React.FC<ModalProps> = ({ isOpen, onClose, header, description, children, onBack }) => {
  const modelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelRef.current && !modelRef.current.contains(event.target as Node)) {
        onClose();
      }

    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);
  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 px-2">
      <div
        ref={modelRef}
        className="bg-white rounded-lg shadow-lg p-4 sm:p-6 max-w-sm sm:max-w-lg md:max-w-3xl max-h-[95vh] overflow-hidden w-full"

      >
        {/* Close & Back */}
        <div className="flex justify-between items-center mb-2">
          <ArrowLeftOutlined style={{ fontSize: 18 }} onClick={onBack} />
          <CloseOutlined
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
            style={{ fontSize: 18 }}
          />
        </div>

        {/* Header and Description */}
        <div className="mb-4">
          <h2 className="text-base sm:text-lg font-bold text-left">{header}</h2>
          <p className="text-sm text-gray-600 text-left">{description}</p>
        </div>

        {/* Content */}
        <div className="w-full overflow-y-auto max-h-[75vh] pr-2">
          {children}
        </div>

      </div>
    </div>

  );

};
export default PostFromFacebook;