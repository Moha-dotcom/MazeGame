const { Engine, Render, Runner, World, Bodies} = Matter;

const engine = Engine.create();// Create A 
const { world } = engine; 

let width =  800;
let height =  800

const render = Render.create({
  element: document.body,

  engine: engine,
  options: {
    wireframes : true,
    width,
    height
  }
});
Render.run(render);
Runner.run(Runner.create(), engine); 



const wall = [
    Bodies.rectangle(width/ 2, 0, width, 40 , {isStatic : true}),
    Bodies.rectangle(width /2, height, width, 40 , {isStatic : true}),
    Bodies.rectangle(0, height / 2, 40, height , {isStatic : true}),
    Bodies.rectangle(width, height /2, 40, height , {isStatic : true})
]

World.add(world, wall)

const cell = 20;
let unitLength = height / cell;
const grid = Array(cell).fill(null).map(() =>  Array(cell).fill(false)); 
const vertical = Array(cell).fill(null).map(() =>  Array(cell -1).fill(false)); 
const Horizaontal = Array(cell -1).fill(null).map(() =>  Array(cell).fill(false)); 
console.log(grid)


// Shuffling the Neighbors Visisted
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

 
const startRow = Math.floor(Math.random() * cell)
const StartCol = Math.floor(Math.random() * cell)

const StepThroughCell = (row , colum) => {
    // If i have visited the cell at [row, column] then return 

    if(grid[row][colum]) return;
    // Mark this cell as Visited
    grid[row][colum] = true;
    //Assemble randomly-ordered list of neighbors

    const neighbor = [
        [row - 1, colum, 'up'],
        [row, colum + 1, 'right'],
        [row + 1, colum, 'down'],
        [row, colum -1, 'left'],
    ]
shuffle(neighbor);




    // For each neighor 

        for(let neighbors of neighbor ){
            const [nextRow, nextColumn, direction] = neighbors;

            if(nextRow < 0 || nextRow >= cell ||nextColumn < 0 || nextColumn >= cell ){
                continue;
            }


            if(grid[nextRow][nextColumn]){
                continue;
            }


        if(direction === 'left'){
            vertical[row][colum-1] = true;
        }else if(direction === 'right'){
            vertical[row][colum] = true;
        }else  if(direction === 'up'){
            Horizaontal[row-1][colum] =true
        }else  if(direction === 'down'){
            Horizaontal[row][colum] =true
        }

        StepThroughCell(nextRow, nextColumn)

        }



        // - see if that neighbor is out of the bounds
        // If we visited that neighbor , continue to the next neighbor
        // Remove a wall from either horizonatal or verticals
        // visit the next cell

}



StepThroughCell(startRow, StartCol)


Horizaontal.forEach((row, rowindex) => {
   row.forEach((open, columnindex) => {
    if(open) {
        return
    }else{
        const wall = Bodies.rectangle(
            columnindex * unitLength  + unitLength / 2,
             rowindex * unitLength + unitLength,
             unitLength, 
             10,
             {isStatic : true});

            World.add(world, wall)

    }
   })

})



vertical.forEach((row, rowindex) => {
    row.forEach((open, columnindex) => {
     if(open) {
         return
     }else{
         const wall = Bodies.rectangle(
            columnindex * unitLength  + unitLength,
            rowindex * unitLength + unitLength / 2,
            10,
            unitLength,
            {isStatic : true}
            );
 
             World.add(world, wall)
 
     }
    })
 
 })