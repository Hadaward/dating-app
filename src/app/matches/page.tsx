'use client';

import MatchCard from "@/components/MatchCard";
import NavigationBar from "@/components/NavigationBar";
import gateways from "@/lib/client/gateways";
import { Favorite } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Match {
  id: string;
  createdAt: Date;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    photos: Array<{ id: string; url: string }>;
  };
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(gateways.MATCHES());
      
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      } else if (response.status === 401) {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Erro ao carregar matches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Header */}
      <div className="w-full p-6">
        <h1 className="text-white text-3xl font-bold">Matches</h1>
        <p className="text-gray-400 mt-1">
          {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-white text-xl">Carregando...</div>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Favorite className="text-gray-600 text-6xl mb-4" />
            <p className="text-white text-xl font-semibold mb-2">
              Você ainda não tem matches
            </p>
            <p className="text-gray-400">
              Continue curtindo perfis para fazer novos matches!
            </p>
            <button
              onClick={() => router.push('/home')}
              className="mt-6 px-6 py-3 bg-pink-500 rounded-full text-white font-semibold hover:bg-pink-600 transition-colors"
            >
              Começar a curtir
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      <NavigationBar />
    </main>
  );
}
