# Visualisateur de Fonctions Mathématiques

Un outil interactif pour visualiser des fonctions mathématiques, créé avec p5.js et math.js. Parfait pour l'enseignement des mathématiques et l'exploration des fonctions.

## Fonctionnalités

- **Saisie de fonction** : Entrez n'importe quelle expression mathématique (ex: `x^2`, `sin(x)`, `10/(x-4)`)
- **Tableau de valeurs** : 
  - Affichage des coordonnées (x, y) pour chaque point calculé
  - Mise en évidence des valeurs lors de la sélection d'un point sur le graphique

- **Graphique interactif** :
  - Points cliquables avec lignes de repère
  - Option pour afficher la courbe continue
  - Axes gradués avec flèches directionnelles
  - Gestion intelligente des discontinuités

- **Paramètres personnalisables** :
  - Choix de l'intervalle [xmin, xmax]
  - Pas de calcul ajustable
  - Échelle en y automatique ou manuelle
  - Graduations adaptatives

## Technologies utilisées

- [p5.js](https://p5js.org/) pour le rendu graphique
- [math.js](https://mathjs.org/) pour l'évaluation des expressions mathématiques
- HTML/CSS pour l'interface utilisateur

## Fonctions mathématiques supportées

Grâce à math.js, vous pouvez utiliser :
- Opérations de base : +, -, *, /, ^
- Fonctions trigonométriques : sin(x), cos(x), tan(x)
- Fonctions exponentielles et logarithmiques : exp(x), log(x)
- Et bien d'autres fonctions mathématiques standard

## Exemples de fonctions

- `x^2` : fonction carrée
- `sin(x)` : fonction sinus
- `10/(x-4)` : fonction avec asymptote verticale
- `exp(x)` : fonction exponentielle
- `log(x)` : logarithme naturel
- `2*x + 1` : fonction affine
