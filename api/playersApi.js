 async function findPlayerByName(name) {
  const res = await fetch(
    `http://localhost:3000/players?name=${encodeURIComponent(name)}`
  );
    if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to find player (status ${res.status})`);
  }

  const players = await res.json();
  
  if (!players || players.length === 0) {
    return null;
  }

  return players[0]; 
}

 async function createPlayer(name) {
  const res = await fetch("http://localhost:3000/players", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, lowestTime: null }),
  });
  if (!res.ok) {
    throw new Error(`Failed to create player (status ${res.status})`);
  }
  return await res.json();
}
async function updatePlayer(player) {
  try {
    const res = await fetch(`http://localhost:3000/players/${player.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(player),
    });
    if (!res.ok) {
      throw new Error(`server responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.log(
      "Could not update player. Is the server running? (npm run server)",
    );
  }
}
async function getAllPlayers() {
  try {
    const res = await fetch("http://localhost:3000/players");
    if (!res.ok) {
      throw new Error(`server responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.log(
      "Could not load players. Is the server running? (npm run server)",
    );
  }
}

export {getAllPlayers, updatePlayer,createPlayer, findPlayerByName}