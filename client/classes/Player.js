// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
export default class Player {
  constructor(name) {
    this.name = name;
    this.time = [];
  }
  recordTime(start, end) {
    const duration = end - start;
    this.time.push(duration);
  }
  showStats() {
    if (this.time.length === 0) {
      console.log("No riddles solved yet.");
      return;
    }
    let total = 0;
    for (const t of this.time) {
      total += t;
    }
    const avg=total/this.time.length;
    console.log("-------stutes riddle-------");
    
    console.log(`the total: ${total/10000}`);
    console.log(`the avg time: ${avg/10000}`);
    
  }
}
