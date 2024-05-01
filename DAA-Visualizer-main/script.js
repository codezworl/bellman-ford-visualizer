const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const runButton = document.getElementById('runAlgorithm');
const resetButton = document.getElementById('resetGraph');
const showPathsButton = document.getElementById('showShortestPaths');
const passesLeftSpan = document.getElementById('passesLeft');
const shortestPathsSpan = document.getElementById('shortestPaths');
const sourceNodeInput = document.getElementById('sourceNode');
const destNodeInput = document.getElementById('destNode');
const edgeWeightInput = document.getElementById('edgeWeight');
const addEdgeButton = document.getElementById('addEdge');
const numVerticesInput = document.getElementById('numVertices');
const generateGraphButton = document.getElementById('generateGraph');

ctx.font = 'bold 16px Arial';

let V = 0; // Number of vertices
let edges = [];
let positions = [];

let iteration = 0;
let edgeIndex = 0;
let distances = Array(V).fill(Infinity);
distances[0] = 0; // Assuming vertex 0 is the source

function drawArrow(fromx, fromy, tox, toy, arrowWidth = 5, color = 'black') {
  const headlen = 15; // Adjusted length of head in pixels for better visibility
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Adjust tox and toy to stop before the vertex circle
  const vertexRadius = 20; // Radius of the vertex circle
  let angle = Math.atan2(toy - fromy, tox - fromx);

  // Calculate the new endpoint of the arrow just before the vertex circle
  tox = tox - vertexRadius * Math.cos(angle);
  toy = toy - vertexRadius * Math.sin(angle);

  // Draw the line of the arrow
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.stroke();

  // Drawing arrow heads
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));
  ctx.lineTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));
  ctx.fill();
}

function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw arrows
  edges.forEach((edge, index) => {
    let color = 'black'; // Default color
    if (index === edgeIndex) {
      color = 'Blue'; // Color when the edge is being processed
    }
    let startX = positions[edge.src].x;
    let startY = positions[edge.src].y;
    let endX = positions[edge.dest].x;
    let endY = positions[edge.dest].y;
    drawArrow(startX, startY, endX, endY, 1, color);
    ctx.fillText(edge.weight, (startX + endX) / 2, (startY + endY) / 2 - 20);
  });

  // Draw vertices
  for (let i = 0; i < V; i++) {
    ctx.beginPath();
    ctx.arc(positions[i].x, positions[i].y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = distances[i] < Infinity ? 'green' : 'red';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.fillText(i, positions[i].x - 5, positions[i].y + 5);
    ctx.fillStyle = 'Red';
    ctx.fillText(`Dist: ${distances[i]}`, positions[i].x - 30, positions[i].y + 40);
  }
}

function generatePositions(V) {
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const radius = Math.min(center.x, center.y) - 50;

  const angleIncrement = (2 * Math.PI) / V;

  const positions = [];
  for (let i = 0; i < V; i++) {
    const angle = i * angleIncrement;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    positions.push({ x, y });
  }

  return positions;
}

generateGraph
generateGraphButton.addEventListener('click', () => {
  V = parseInt(numVerticesInput.value, 10);
  if (isNaN(V) || V <= 0) {
    alert("Please enter a valid number of vertices.");
    return;
  }

  positions = generatePositions(V); // Update positions based on V
  edges = []; // Reset edges
  distances = Array(V).fill(Infinity);
  distances[0] = 0; // Assuming vertex 0 as the source

  drawGraph();
  updateInfo();
});

function updatePassesLeft() {
  passesLeftSpan.textContent = V - 1 - iteration;
}

function updateInfo() {
  updatePassesLeft();
  if (iteration >= V - 1) {
    shortestPathsSpan.textContent = distances.map(d => d === Infinity ? "Infinity" : d).join(', ');
  }
}

function bellmanFordStep() {
if (iteration < V - 1) {
const edge = edges[edgeIndex];
if (distances[edge.src] !== Infinity && distances[edge.src] + edge.weight < distances[edge.dest]) {
  distances[edge.dest] = distances[edge.src] + edge.weight;
}
drawGraph();
edgeIndex++;
if (edgeIndex >= edges.length) {
  edgeIndex = 0;
  iteration++;
}
currentIterationSpan.textContent = iteration;
} else {
alert("Algorithm has finished running!");
}
updateInfo();
}


function resetGraph() {
  iteration = 0;
  edgeIndex = 0;
  distances = Array(V).fill(Infinity);
  distances[0] = 0;
  drawGraph();
  updateInfo();
  currentIterationSpan.textContent = iteration;
}

function addEdge() {
  const source = parseInt(sourceNodeInput.value, 10);
  const dest = parseInt(destNodeInput.value, 10);
  const weight = parseInt(edgeWeightInput.value, 10);

  // Validate input
  if (isNaN(source) || isNaN(dest) || isNaN(weight)) {
    alert("Please enter valid numbers for source, destination, and weight.");
    return;
  }

  // Add edge to the edges array
  edges.push({ src: source, dest: dest, weight: weight });
  drawGraph(); // Redraw the graph

  // Clear input fields
  sourceNodeInput.value = '';
  destNodeInput.value = '';
  edgeWeightInput.value = '';
}

runButton.addEventListener('click', bellmanFordStep);
resetButton.addEventListener('click', resetGraph);
addEdgeButton.addEventListener('click', addEdge);

// [Your existing code for showPathsButton click event]

// Initialize Graph
drawGraph();
updateInfo();
