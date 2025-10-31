export interface ButtonProps {
    children?: React.ReactNode;
    type: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ children, type, disabled, onClick }: ButtonProps) {
    return (
        <button
            type={type}
            className="w-full rounded-[80px] p-4 bg-[linear-gradient(87.08deg,#DD3562_6.8%,#8354FF_102.07%)] font-lexend font-semibold text-lg text-white hover:opacity-90 transition-opacity duration-200 cursor-pointer"
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}