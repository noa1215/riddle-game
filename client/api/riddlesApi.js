async function getAllRiddles(){
    let arrRiddle = [];
try {
  const res = await fetch("http://localhost:3000/api/riddles");
  if (!res.ok) {
    throw new Error(`Server responded with status ${res.status}`);
  }
  arrRiddle = await res.json();
} catch (err) {
 console.log("Could not fetch riddles:", err.message);  process.exit(1);
}
return arrRiddle;
}

async function getRiddleById(id) {
  const res = await fetch(`http://localhost:3000/api/riddles/${id}`);
  if (!res.ok) {
    throw new Error(`Could not load riddle ${id}: server responded with status ${res.status}`);
  }
  return await res.json();
}

async function createRiddle(riddle) {
  try {
    const res = await fetch("http://localhost:3000/api/riddles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(riddle)
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(`Server responded with status ${res.status}: ${error.error}`);
    }
    return await res.json();
  } catch (err) {
 console.log("Could not create riddle:", err.message);    process.exit(1);
  }
}

async function updateRiddle(id, riddle) {
  try {
    const res = await fetch(`http://localhost:3000/api/riddles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(riddle)
    });
    if (!res.ok) {
      throw new Error(`Server responded with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
 console.log("Could not update riddle:", err.message);    process.exit(1);
  }
}
async function deleteRiddle(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/riddles/${id}`, {    
    method: "DELETE" ,
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (!res.ok) {
    throw new Error(`Server responded with status ${res.status}`);
  }
  return await res.json();
} catch (err) {
 console.log("Could not delete riddle:", err.message);  process.exit(1);

}}

export { getAllRiddles, getRiddleById, createRiddle, updateRiddle, deleteRiddle };