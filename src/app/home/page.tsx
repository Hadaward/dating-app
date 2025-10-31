'use client';

import MatchModal from "@/components/MatchModal";
import NavigationBar from "@/components/NavigationBar";
import SwipeableCard from "@/components/SwipeableCard";
import gateways from "@/lib/client/gateways";
import { Add, Notifications, Search, Tune } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  photos: Array<{ id: string; url: string }>;
  profile: {
    id: string;
    gender: string;
    preference: string;
  } | null;
  interests: Array<{ 
    id: string;
    interest: { id: string; name: string } 
  }>;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [matchedUser, setMatchedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(gateways.DISCOVER(20));
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else if (response.status === 401) {
        router.push('/signin');
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (userId: string, type: 'LIKE' | 'SUPER_LIKE' | 'DISLIKE') => {
    try {
      const response = await fetch(gateways.CREATE_REACTION(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toUserId: userId,
          type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.matched) {
          const matchedUser = users[currentIndex];
          setMatchedUser(matchedUser);
        }

        // Avançar para o próximo usuário
        setCurrentIndex(currentIndex + 1);

        // Carregar mais usuários se estiver perto do fim
        if (currentIndex >= users.length - 3) {
          loadUsers();
        }
      }
    } catch (error) {
      console.error('Erro ao reagir:', error);
    }
  };

  const currentUser = users[currentIndex];

  if (loading && users.length === 0) {
    return (
      <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center justify-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        <div className="text-white text-xl">Carregando...</div>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
        <div className="w-full h-16 p-6 flex items-center justify-between">
          <div className="flex justify-center items-center gap-2">
            <div 
              className="bg-[linear-gradient(150.7deg,#F64A69_26.19%,#EF3349_72.96%)] p-1 rounded-full"
              style={{
                boxShadow: 'inset -9.87px -9.87px 17.76px 0px #B5101C, 9.54px 6.82px 19.64px 0px #31141B'
              }}
            >
              <Add className="text-white" />
            </div>
            <span className="text-center font-lexend font-semibold text-white text-lg">
              Add Story
            </span>
          </div>
          <div className="flex justify-center items-center gap-4">
            <button>
              <Search className="text-white" />
            </button>
            <button>
              <Notifications className="text-white" />
            </button>
            <button>
              <Tune className="text-white" />
            </button>
          </div>
        </div>
        <section className="w-full h-full p-6 flex flex-col items-center justify-center">
          <div className="text-white text-center">
            <p className="text-2xl font-bold mb-2">Não há mais perfis no momento</p>
            <p className="text-gray-400">Volte mais tarde para ver novos perfis!</p>
            <button
              onClick={loadUsers}
              className="mt-6 px-6 py-3 bg-pink-500 rounded-full text-white font-semibold hover:bg-pink-600 transition-colors"
            >
              Recarregar
            </button>
          </div>
        </section>
        <NavigationBar />
      </main>
    );
  }

  return (
    <main className="relative w-full md:w-md h-screen overflow-hidden flex flex-col items-center bg-[linear-gradient(180deg,#140034_0%,#01010D_100%)]">
      {/* Top Navigation Bar */}
      <div className="w-full h-16 p-6 flex items-center justify-between">
        <div className="flex justify-center items-center gap-2">
          <div 
            className="bg-[linear-gradient(150.7deg,#F64A69_26.19%,#EF3349_72.96%)] p-1 rounded-full"
            style={{
              boxShadow: 'inset -9.87px -9.87px 17.76px 0px #B5101C, 9.54px 6.82px 19.64px 0px #31141B'
            }}
          >
            <Add className="text-white" />
          </div>
          <span className="text-center font-lexend font-semibold text-white text-lg">
            Add Story
          </span>
        </div>
        <div className="flex justify-center items-center gap-4">
          <button>
            <Search className="text-white" />
          </button>
          <button>
            <Notifications className="text-white" />
          </button>
          <button>
            <Tune className="text-white" />
          </button>
        </div>
      </div>

      <section className="w-full flex-1 p-6 flex items-center justify-center">
        <SwipeableCard
          user={currentUser}
          onLike={(userId) => handleReaction(userId, 'LIKE')}
          onSuperLike={(userId) => handleReaction(userId, 'SUPER_LIKE')}
          onDislike={(userId) => handleReaction(userId, 'DISLIKE')}
          onProfileClick={(userId) => router.push(`/profile/${userId}`)}
        />
      </section>

      <NavigationBar />

      {/* Match Modal */}
      {matchedUser && (
        <MatchModal
          user={matchedUser}
          onClose={() => setMatchedUser(null)}
        />
      )}
    </main>
  );
}