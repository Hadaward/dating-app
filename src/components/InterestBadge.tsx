"use client";

import CameraAlt from "@mui/icons-material/CameraAlt";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
import Flight from "@mui/icons-material/Flight";
import LocalBar from "@mui/icons-material/LocalBar";
import Mic from "@mui/icons-material/Mic";
import MusicNote from "@mui/icons-material/MusicNote";
import Palette from "@mui/icons-material/Palette";
import Pool from "@mui/icons-material/Pool";
import Restaurant from "@mui/icons-material/Restaurant";
import ShoppingBag from "@mui/icons-material/ShoppingBag";
import SportsEsports from "@mui/icons-material/SportsEsports";
import Terrain from "@mui/icons-material/Terrain";

interface InterestBadgeProps {
  name: string;
  iconName: string;
}

const iconMap: Record<string, React.ReactNode> = {
  camera: <CameraAlt />,
  cooking: <Restaurant />,
  gamepad: <SportsEsports />,
  music: <MusicNote />,
  airplane: <Flight />,
  "shopping-bag": <ShoppingBag />,
  microphone: <Mic />,
  palette: <Palette />,
  water: <Pool />,
  wine: <LocalBar />,
  mountain: <Terrain />,
  dumbbell: <FitnessCenter />,
};

export default function InterestBadge({ name, iconName }: InterestBadgeProps) {
  return (
    <div className="px-5 py-3 rounded-full bg-[#251759] border border-purple-700/50 flex items-center gap-2">
      <span className="text-white/70">
        {iconMap[iconName] || <CameraAlt />}
      </span>
      <span className="text-white font-lexend font-medium text-sm">
        {name}
      </span>
    </div>
  );
}
