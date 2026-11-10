async function findPlayerByName(name) {
  const res = await fetch(
    `http://localhost:3000/api/players?name=${encodeURIComponent(name)}`,
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
  const res = await fetch("http://localhost:3000/api/players", {
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
  const url = `http://localhost:3000/api/players/${player.id}`;
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      const isTemporaryNetworkError = [
        "ECONNRESET",
        "ECONNREFUSED",
        "ETIMEDOUT",
      ].includes(err.cause?.code);

      if (attempt === 0 && isTemporaryNetworkError) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        continue;
      }

      console.error("Could not update player:", err.message);
      throw err;
    }
  }
}
async function getAllPlayers() {
  try {
    const res = await fetch("http://localhost:3000/api/players");
    if (!res.ok) {
      throw new Error(`server responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Could not load players:", err.message);
    throw err;
  }
}

export { getAllPlayers, updatePlayer, createPlayer, findPlayerByName };
