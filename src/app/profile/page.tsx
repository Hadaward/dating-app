'use client';

import NavigationBar from "@/components/NavigationBar";
import gateways from "@/lib/client/gateways";
import { EmojiEvents, Favorite, People, Star } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Stats {
  totalLikes: number;
  totalSuperLikes: number;
  totalMatches: number;
  totalLikesReceived: number;
}

export default function ProfilePage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(gateways.STATS());
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Limpar cookie e redirecionar
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    router.push('/signin');
  };

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Header */}
      <div className="w-full p-6">
        <h1 className="text-white text-3xl font-bold">Meu Perfil</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-white text-xl">Carregando...</div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Favorite className="text-pink-400" />
                  <span className="text-white text-sm font-semibold">Likes Enviados</span>
                </div>
                <p className="text-white text-3xl font-bold">{stats?.totalLikes || 0}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="text-blue-400" />
                  <span className="text-white text-sm font-semibold">Super Likes</span>
                </div>
                <p className="text-white text-3xl font-bold">{stats?.totalSuperLikes || 0}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <People className="text-purple-400" />
                  <span className="text-white text-sm font-semibold">Matches</span>
                </div>
                <p className="text-white text-3xl font-bold">{stats?.totalMatches || 0}</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <EmojiEvents className="text-yellow-400" />
                  <span className="text-white text-sm font-semibold">Likes Recebidos</span>
                </div>
                <p className="text-white text-3xl font-bold">{stats?.totalLikesReceived || 0}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => router.push('/matches')}
                className="w-full py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Ver Meus Matches
              </button>
              <button
                onClick={() => router.push('/likes')}
                className="w-full py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/20 transition-colors"
              >
                Ver Quem Me Curtiu
              </button>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h2 className="text-white text-xl font-bold mb-3">Configurações</h2>
              <button
                className="w-full py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/20 transition-colors text-left px-4"
              >
                Editar Perfil
              </button>
              <button
                className="w-full py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/20 transition-colors text-left px-4"
              >
                Preferências
              </button>
              <button
                className="w-full py-4 bg-white/10 backdrop-blur-sm rounded-2xl text-white font-semibold hover:bg-white/20 transition-colors text-left px-4"
              >
                Privacidade e Segurança
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-4 bg-red-500/20 backdrop-blur-sm rounded-2xl text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
              >
                Sair
              </button>
            </div>
          </>
        )}
      </div>

      <NavigationBar />
    </main>
  );
}
