async function getAllRiddles(){
    let arrRiddle = [];
try {
  const res = await fetch("http://localhost:3000/riddles");
  if (!res.ok) {
    throw new Error(`Server responded with status ${res.status}`);
  }
  arrRiddle = await res.json();
} catch (err) {
  console.log("Could not load riddles. Is the server running? (npm run server)");
  process.exit(1);
}
return arrRiddle;
}

async function createRiddle(riddle) {
  try {
    const res = await fetch("http://localhost:3000/riddles", {
      method: "POST",
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
    console.log("Could not create riddle. Is the server running? (npm run server)");
    process.exit(1);
  }
}

async function updateRiddle(id, riddle) {
  try {
    const res = await fetch(`http://localhost:3000/riddles/${id}`, {
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
    console.log("Could not update riddle. Is the server running? (npm run server)");
    process.exit(1);
  }
}
async function deleteRiddle(id) {
  try {
    const res = await fetch(`http://localhost:3000/riddles/${id}`, {    
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
  console.log("Could not delete riddle. Is the server running? (npm run server)");
  process.exit(1);

}}

export { getAllRiddles, createRiddle, updateRiddle, deleteRiddle };