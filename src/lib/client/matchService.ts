// Exemplo de uso das APIs no cliente

// 1. Descobrir novos usuários
const discoverUsers = async () => {
  const response = await fetch('/api/discover?limit=20');
  const users = await response.json();
  return users;
};

// 2. Dar like em um usuário
const likeUser = async (userId: string) => {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toUserId: userId,
      type: 'LIKE'
    })
  });
  const result = await response.json();
  
  if (result.matched) {
    console.log('É um match! 🎉');
  }
  
  return result;
};

// 3. Dar super like
const superLikeUser = async (userId: string) => {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toUserId: userId,
      type: 'SUPER_LIKE'
    })
  });
  return await response.json();
};

// 4. Dar dislike
const dislikeUser = async (userId: string) => {
  const response = await fetch('/api/reactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      toUserId: userId,
      type: 'DISLIKE'
    })
  });
  return await response.json();
};

// 5. Buscar matches
const getMatches = async () => {
  const response = await fetch('/api/matches');
  const matches = await response.json();
  return matches;
};

// 6. Buscar curtidas recebidas
const getReceivedLikes = async () => {
  const response = await fetch('/api/reactions?type=received');
  const likes = await response.json();
  return likes;
};

// 7. Buscar perfil de usuário
const getUserProfile = async (userId: string) => {
  const response = await fetch(`/api/profile/${userId}`);
  const profile = await response.json();
  return profile;
};

// 8. Buscar estatísticas pessoais
const getMyStats = async () => {
  const response = await fetch('/api/stats');
  const stats = await response.json();
  return stats;
};

// 9. Remover um match
const removeMatch = async (matchId: string) => {
  const response = await fetch(`/api/matches?matchId=${matchId}`, {
    method: 'DELETE'
  });
  return await response.json();
};

export {
  discoverUsers,
  likeUser,
  superLikeUser,
  dislikeUser,
  getMatches,
  getReceivedLikes,
  getUserProfile,
  getMyStats,
  removeMatch
};
