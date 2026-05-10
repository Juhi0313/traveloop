import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
};

export default function Modal({ open, onClose, title, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} flex flex-col max-h-[90vh]`}
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0]">
            <h3 className="text-lg font-bold text-[#1e293b]">{title}</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] transition-colors z-10"
          >
            <X size={18} />
          </button>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-[#e2e8f0] flex gap-3 justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
