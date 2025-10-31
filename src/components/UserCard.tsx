import { CardGiftcard } from "@mui/icons-material";
import Image from "next/image";

export interface UserCardProps {
    photoURL: string;
    name: string;
}

export default function UserCard({ photoURL, name }: UserCardProps) {
    return (
        <div className="w-92 h-128 border-2 border-white rounded-4xl bg-[linear-gradient(180deg,rgba(18,1,48,0)_0%,rgba(14,1,36,0.88)_72.76%)]">
            <div className="w-full h-full flex flex-col justify-between">
                <div className="w-full p-4 flex flex-col items-end">
                    <button className="p-4 rounded-full bg-[linear-gradient(147.03deg,#29005C_11.94%,#11012D_103.04%)]">
                        <CardGiftcard className="text-white" />
                    </button>
                </div>
                <div className="w-full pb-6 px-6 flex flex-row items-center gap-4">
                    <div className="p-2 flex flex-col gap-2 items-center">
                        <div className="relative rounded-full bg-[#612DA6] border-3 border-white w-24 h-24 overflow-hidden">
                            <Image
                                src={photoURL}
                                alt="User Photo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <span className="text-white font-lexend font-semibold text-2xl wrap-break-word">{name}</span>
                </div>
            </div>
        </div>
    )
}