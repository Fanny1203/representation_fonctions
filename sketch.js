let canvas;
let values = [];
let yMin, yMax;
let showCurve = false;
let selectedPoint = null;

function setup() {
    // Création du canvas dans le conteneur dédié
    const canvasHolder = document.getElementById('canvas-holder');
    canvas = createCanvas(800, 400);
    canvas.parent(canvasHolder);
    
    // Écouteurs d'événements
    document.getElementById('calculate').addEventListener('click', calculateValues);
    document.getElementById('show-curve').addEventListener('change', function(e) {
        showCurve = e.target.checked;
        redraw();
    });

    // Ajout de l'écouteur pour le clic sur le canvas
    canvas.mousePressed(handleCanvasClick);
    
    // Configuration de base de p5.js
    noLoop();
    textAlign(CENTER, CENTER);
}

// Fonction pour gérer le clic sur le canvas
function handleCanvasClick() {
    const margin = 40;
    const xmin = values[0].x;
    const xmax = values[values.length - 1].x;
    
    // Fonctions de transformation des coordonnées
    const mapX = (x) => map(x, xmin, xmax, margin, width - margin);
    const mapY = (y) => map(y, yMin, yMax, height - margin, margin);
    
    // Recherche du point le plus proche
    let closestPoint = null;
    let minDistance = Infinity;
    
    values.forEach((value, index) => {
        const screenX = mapX(value.x);
        const screenY = mapY(value.y);
        const d = dist(mouseX, mouseY, screenX, screenY);
        
        if (d < minDistance && d < 15) { // 15 pixels de tolérance pour le clic
            minDistance = d;
            closestPoint = index;
        }
    });
    
    // Mise à jour du point sélectionné
    selectedPoint = closestPoint;
    
    // Mise à jour du tableau
    updateTableSelection();
    
    // Redessiner le canvas
    redraw();
}

// Fonction pour mettre à jour la sélection dans le tableau
function updateTableSelection() {
    // Réinitialiser toutes les cellules
    const cells = document.querySelectorAll('.table-cell');
    cells.forEach(cell => cell.classList.remove('selected'));
    
    if (selectedPoint !== null) {
        // Sélectionner les cellules correspondantes (x et y)
        const xCells = document.querySelectorAll('.table-row:first-child .table-cell');
        const yCells = document.querySelectorAll('.table-row:last-child .table-cell');
        
        // +1 car la première cellule est l'en-tête
        xCells[selectedPoint + 1].classList.add('selected');
        yCells[selectedPoint + 1].classList.add('selected');
    }
}

function calculateValues() {
    // Récupération des valeurs des inputs
    const fn = document.getElementById('function').value;
    const xmin = parseFloat(document.getElementById('xmin').value);
    const xmax = parseFloat(document.getElementById('xmax').value);
    const step = parseFloat(document.getElementById('step').value);
    
    try {
        // Compilation de la fonction avec math.js
        const f = math.compile(fn);
        
        // Calcul des valeurs
        values = [];
        for (let x = xmin; x <= xmax; x += step) {
            try {
                const y = f.evaluate({x: x});
                values.push({x: x, y: y});
            } catch (e) {
                console.error('Erreur de calcul pour x =', x, e);
            }
        }
        
        // Calcul des bornes en y
        yMin = math.min(values.map(v => v.y));
        yMax = math.max(values.map(v => v.y));
        
        // Ajout d'une marge de 10%
        const yRange = yMax - yMin;
        yMin -= yRange * 0.1;
        yMax += yRange * 0.1;
        
        // Affichage du tableau de valeurs
        displayTable();
        
        // Redessiner le graphique
        redraw();
        
    } catch (e) {
        alert('Erreur dans la formule : ' + e.message);
    }
}

function displayTable() {
    const container = document.getElementById('value-table');
    container.innerHTML = '';
    
    // Création de la ligne pour x
    const xRow = document.createElement('div');
    xRow.className = 'table-row';
    
    // Création de la ligne pour y
    const yRow = document.createElement('div');
    yRow.className = 'table-row';
    
    // Ajout des cellules d'en-tête
    const xHeader = document.createElement('div');
    xHeader.className = 'table-cell header-cell';
    xHeader.textContent = 'x';
    xRow.appendChild(xHeader);
    
    const yHeader = document.createElement('div');
    yHeader.className = 'table-cell header-cell';
    yHeader.textContent = 'y = f(x)';
    yRow.appendChild(yHeader);
    
    // Ajout des valeurs
    values.forEach(value => {
        const xCell = document.createElement('div');
        xCell.className = 'table-cell';
        xCell.textContent = value.x.toFixed(2);
        xRow.appendChild(xCell);
        
        const yCell = document.createElement('div');
        yCell.className = 'table-cell';
        yCell.textContent = value.y.toFixed(2);
        yRow.appendChild(yCell);
    });
    
    container.appendChild(xRow);
    container.appendChild(yRow);
}

function draw() {
    background(255);
    
    if (values.length === 0) return;
    
    // Configuration du système de coordonnées
    const xmin = values[0].x;
    const xmax = values[values.length - 1].x;
    
    // Marges
    const margin = 40;
    
    // Transformation des coordonnées
    const mapX = (x) => map(x, xmin, xmax, margin, width - margin);
    const mapY = (y) => map(y, yMin, yMax, height - margin, margin);
    
    // Dessin des axes
    stroke(100);
    strokeWeight(1);
    
    // Axe X
    line(margin, mapY(0), width - margin, mapY(0));
    // Axe Y
    line(mapX(0), margin, mapX(0), height - margin);
    
    // Graduations et valeurs sur l'axe X
    for (let x = Math.ceil(xmin); x <= Math.floor(xmax); x++) {
        const screenX = mapX(x);
        stroke(200);
        strokeWeight(1);
        line(screenX, mapY(0) - 5, screenX, mapY(0) + 5);
        noStroke();
        textSize(10);
        fill(150);
        text(x, screenX, mapY(0) + 15);
    }
    
    // Graduations et valeurs sur l'axe Y
    // Calcul de l'ordre de grandeur pour les graduations
    const yRange = yMax - yMin;
    const magnitude = Math.floor(Math.log10(yRange));
    let step = Math.pow(10, magnitude - 1);
    
    // Ajustement du pas pour avoir au maximum 20 graduations
    const numGraduations = yRange / step;
    if (numGraduations > 20) {
        if (numGraduations <= 40) {
            step = step * 2;
        } else if (numGraduations <= 50) {
            step = step * 3;
        } else if (numGraduations <= 100) {
            step = step * 5;
        } else {
            step = step * Math.ceil(numGraduations / 20);
        }
    }
    
    // Calcul de la première graduation
    const firstTick = Math.ceil(yMin / step) * step;
    
    // Dessin des graduations
    for (let y = firstTick; y <= yMax; y += step) {
        const screenY = mapY(y);
        stroke(200);
        strokeWeight(1);
        line(mapX(0) - 5, screenY, mapX(0) + 5, screenY);
        noStroke();
        textSize(10);
        fill(150);
        // Formater le nombre pour éviter les décimales inutiles
        const yDisplay = Math.abs(y) < 1e-10 ? "0" : y.toPrecision(3);
        text(yDisplay, mapX(0) - 25, screenY);
    }
    
    // Dessin des points
    stroke(255, 0, 0);
    strokeWeight(6);
    values.forEach((value, index) => {
        if (index === selectedPoint) {
            // Point sélectionné plus gros et avec un contour
            stroke(255);
            strokeWeight(8);
            point(mapX(value.x), mapY(value.y));
            stroke(255, 0, 0);
            strokeWeight(6);
        }
        point(mapX(value.x), mapY(value.y));
    });
    
    // Dessin des lignes pointillées pour le point sélectionné
    if (selectedPoint !== null) {
        const selectedX = values[selectedPoint].x;
        const selectedY = values[selectedPoint].y;
        
        // Style des lignes pointillées
        stroke(150);
        strokeWeight(1);
        drawingContext.setLineDash([5, 5]); // Ligne pointillée
        
        // Ligne verticale
        line(mapX(selectedX), margin, mapX(selectedX), height - margin);
        // Ligne horizontale
        line(margin, mapY(selectedY), width - margin, mapY(selectedY));
        
        // Réinitialiser le style de ligne
        drawingContext.setLineDash([]);
    }
    
    // Dessin de la courbe si demandé
    if (showCurve) {
        stroke(0, 0, 255);
        strokeWeight(1);
        noFill();
        beginShape();
        const f = math.compile(document.getElementById('function').value);
        for (let px = 0; px <= width; px++) {
            const x = map(px, 0, width, xmin, xmax);
            try {
                const y = f.evaluate({x: x});
                vertex(px, mapY(y));
            } catch (e) {
                // Ignorer les points où la fonction n'est pas définie
            }
        }
        endShape();
    }
}
