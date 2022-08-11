const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const [cos, sin, PI] = [Math.cos, Math.sin, Math.PI];

const a = PI / 3; // 60 degrees

// Adapted from from: https://eperezcosano.github.io/hex-grid/
const drawHexagon = (mid, r, fill) => {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      ctx.lineTo(mid.x + r * cos(a * i), mid.y + r * sin(a * i));
    }
    ctx.closePath();
    fill && ctx.fill();
    ctx.stroke();
}

const moveAdjacent = (pos, r, angle) => {
    const distance =  2* r * sin(PI / 3);
    const dx = distance * cos(angle);
    const dy = distance * sin(angle);

    return {
        x: pos.x+dx, 
        y: pos.y+dy
    };
}

const hexArray = (start, rings, rules) => {
    const arr = [[...start[0]], [...start[1]]];
    let prevRow = arr[1];
    for(let ring_num = 2; ring_num < rings + 1; ring_num++) {
        const currRow = [];
        let currentIdx = 0;
        let prevRowIdx = 0;
        for(let i = 0; i < 6; i++) {
            currRow.push('dummy');
            currentIdx++; // skip the six diagonals, we'll return to them
            for (let j = 1; j < ring_num; j++) {
                const parents = prevRow[prevRowIdx] + prevRow[(prevRowIdx+1) %prevRow.length] + prevRow[(prevRowIdx+2) % prevRow.length];
                // console.log("prevRow len", prevRow.length, "prevRowIdx", prevRowIdx);
                // console.log(parents, rules[parents]);
                currRow.push(rules[parents]);
                currentIdx++;
                prevRowIdx++;
                
            }
        }
        for(let i = 0; i < 6; i++) { // handle the diagonals
            const diagIdx = i * ring_num;
   
            const firstParentIdx = diagIdx ? diagIdx - 1 : currRow.length - 1;
            const midParentIdx = i * (ring_num - 1);
            const lastParentIdx = diagIdx + 1;

            let parents = currRow[firstParentIdx] +
                          prevRow[midParentIdx] +
                          currRow[lastParentIdx];
            // console.log(parents)
            currRow[diagIdx] = rules[parents];

        }
        arr.push(currRow);
        prevRow = currRow;
    }
    return arr;
}

const drawMultiHexagon = async (mid, r, rings, fillPattern, delay) => {
    let count = 0;
    let current = mid;
    let patternIdx = 0;
    count++;

    patternIdx++; // Skip first hex because bug
    // TOOD: debug issue with first hex
    //drawHexagon(current, r, fillPattern[patternIdx++]);
    //invesigate issue with center hex
    for(let ring_num = 1; ring_num < rings + 1; ring_num++) {
        current = moveAdjacent(current, r, a/2);
        let angle = a/2 + a;
        for(let i = 0; i < 6; i++) {
            for (let j = 0; j < ring_num; j++) {
                count++;
                drawHexagon(current, r, fillPattern[patternIdx++]);
                current = moveAdjacent(current, r, angle);
                if (delay) await new Promise(r => setTimeout(r, delay));
            }
            angle += a;
        }
        current = moveAdjacent(current, r, -angle);
    }
    console.log(count);
}


const strToRules = (str) => {
    return {
        '111': str[0],
        '110': str[1],
        '101': str[2],
        '100': str[3],
        '011': str[4],
        '010': str[5],
        '001': str[6],
        '000': str[7]
    };
}

const strToBase = (str) => {
    return [['0'], str.split('')];
}

const makeIt = (center, ruleStr, baseStr, radius, rings, delay) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const rules = strToRules(ruleStr);
    const base = strToBase(baseStr);

    const flatArr = hexArray(base, rings, rules).flat();
    const pattern = flatArr.map((val) => val === '0');
    drawMultiHexagon(center, radius, rings, pattern, delay);
}

const init = () => {
    // Purdy
    // makeIt({x:3000, y:3000}, '00110110', '111111', 10, 18, 1);
    // Spirals
    //makeIt({x:3000, y:3000}, '00101010', '011011', 3, 66);
    // Chaos
    //makeIt({x:3000, y:3000}, '01011010', '101110', 2, 100);
    // Optical Illusion
    //makeIt({x:3000, y:3000}, '01011110', '101010', 4, 50);
    // Triangles
    //makeIt({x:3000, y:3000}, '01111110', '101010', 3, 66);
    // Wavy
    //makeIt({x:3000, y:3000}, '01110101', '010011', 3, 66);
    //Equilaterals (computationally universal?)
    //makeIt({x:3000, y:2000}, '01111100', '101010', 2, 1000);
    // Actual size for <200 hexes
    //makeIt({x:3000, y:2000}, '00110110', '111111', 28, 7);
    // Wave
    //makeIt({x:canvas.width/2, y:canvas.height/2}, '10101110', '010000', 3, 66);
    // Spiral Sierpinski
    //makeIt({x:canvas.width/2, y:canvas.height/2}, '10100110', '011000', 3, 66);
    // Inverted Sierpinski
    //makeIt({x:canvas.width/2, y:canvas.height/2}, '00111100', '101011', 2, 100);
    // Offshoots
    //makeIt({x:canvas.width/2, y:canvas.height/2}, '01111000', '101000', 2, 100);
    // Yin-Yang
    // makeIt({x:canvas.width/2, y:canvas.height/2}, '10101010', '011100', 3, 66);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    makeIt({x:canvas.width/2, y:canvas.height/2}, '10100110', '011000', 3, 66);
}

// Yoinked from: https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomize = () => {
    // TODO handle stopping of old animation.
    const rule = randomIntFromInterval(0, 255).toString(2).padStart(8, '0');
    const start = randomIntFromInterval(0, 63).toString(2).padStart(6, '0');
    console.log(`makeIt({x:canvas.width/2, y:canvas.height/2}, '${rule}', '${start}', 3, 66);`);
    makeIt({x:canvas.width/2, y:canvas.height/2}, rule, start, 3, 66);
}

init(); 

