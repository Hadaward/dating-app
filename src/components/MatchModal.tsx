'use client';

import { Favorite } from '@mui/icons-material';
import { useState } from 'react';

interface MatchModalProps {
    user: {
        firstName: string;
        photos: Array<{ url: string }>;
    };
    onClose: () => void;
}

export default function MatchModal({ user, onClose }: MatchModalProps) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    return (
        <div 
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleClose}
        >
            <div 
                className={`relative bg-gradient-to-b from-pink-500 to-purple-600 rounded-3xl p-8 max-w-md w-full mx-4 transform transition-all duration-300 ${
                    isVisible ? 'scale-100' : 'scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Match icon */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <Favorite className="text-white text-8xl animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 bg-white/20 rounded-full animate-ping" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-white text-4xl font-bold text-center mb-2">
                    É um Match!
                </h2>

                {/* Message */}
                <p className="text-white/90 text-center mb-6">
                    Você e {user.firstName} deram like um no outro!
                </p>

                {/* Action buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-white text-pink-500 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Enviar Mensagem
                    </button>
                    <button
                        onClick={handleClose}
                        className="w-full py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
                    >
                        Continuar Navegando
                    </button>
                </div>
            </div>
        </div>
    );
}
