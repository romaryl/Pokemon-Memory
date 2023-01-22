// fonction de génération d'entiers aléatoires dans une tranche donnée
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// fonction de mélange d'une array (source : internet)
function randomize(values) {
    let index = values.length,
        randomIndex;

    while (index != 0) {
        randomIndex = Math.floor(Math.random() * index);
        index--;

        [values[index], values[randomIndex]] = [
            values[randomIndex], values[index]];
    }
    return values;
}

// fonction de backflip, retourne l'objet sur lui-même selon l'axe Y
// avec un délais de 100ms sur le changement d'image pour qu'il soit
// masqué par l'animation
function backflip(objet) {

    // rotation de l'objet sur +180° sur l'axe Y
    $(objet).transition({
        perspective: '100px',
        rotateY: '180deg'
    })

    // la classe .backfliped sert à la sélection des cartes retournées
    objet.find(".pokemon").toggleClass("backfliped");

    // alternance de l'affichage du recto et du verso via un toggle sur la classe .d-none
    setTimeout(function () {
        objet.find(".pokemon").toggleClass("d-none").css("transform", "scaleX(-1)"); // miroir de l'image pour contrer l'effet de l'animation
        objet.find(".dessus").toggleClass("d-none");
    }, 100)
}

function unflip(objet) {
    // rotation de l'objet sur +180° sur l'axe Y
    $(objet).transition({
        perspective: '100px',
        rotateY: '0deg'
    })

    // la classe .backfliped sert à la sélection des cartes retournées
    objet.find(".pokemon").toggleClass("backfliped");

    // alternance de l'affichage du recto et du verso via un toggle sur la classe .d-none
    setTimeout(function () {
        objet.find(".pokemon").toggleClass("d-none").css("transform", "scaleX(-1)"); // miroir de l'image pour contrer l'effet de l'animation
        objet.find(".dessus").toggleClass("d-none");
    }, 100)
}

// procédure de recherche des paires
function is_there_a_twin() {
    console.log($(".backfliped"))
    console.log($(".backfliped").slice(0, 1).attr("alt"))
    console.log($(".backfliped").slice(1, 2).attr("alt"))

    // comparaison des attributs "alt" des deux éléments retournés
    if ($(".backfliped").slice(0, 1).attr("alt") == $(".backfliped").slice(1, 2).attr("alt")
        && $(".backfliped").length == 2) {
        return (true)
    }
    else { return (false) }
}

// exécution du programme principal
$(window).on("load", function () {

    //// CONSTRUCTION DU TABLEAU DE JEU ////

    // construction d'un tableau de 8 entiers aléatoires
    let tableau = [];
    while (tableau.length < 8) {
        let random_number = getRandomIntInclusive(1, 200); // assignation d'un nombre aléatoire à une valeur 
        if (!tableau.includes(random_number)) { // vérification de la présence de ce nombre dans le tableau
            tableau[tableau.length] = random_number; // assignation de ce nombre au tableau
        }
        // console.log(tableau)
        // console.log(random_number)
    }

    // construction d'une array de paires de valeurs mélangées
    let array_random = randomize(tableau.concat(tableau)),
        pokemons = [],
        n = 0;
    // console.log(array_random)
    // console.log(pokemons)

    // création d'un tableau associant chaque terme de l'array de valeurs aléatoires à un URL de fichier d'image
    while (n < array_random.length) {
        pokemons[n] = { nom: "Pokemon" + array_random[n], img: "img/Pokemon" + array_random[n] + ".png" };
        n++;
    }

    // injection des URLs d'images précédemment crées dans la source HTML
    pokemons.forEach(pokemon => {
        $("#board").append(` 
        <div class="card-poke container p-0"> 
            <img class="pokemon d-none" src="${pokemon.img}" alt="${pokemon.nom}">
            <img class="dessus" src="img/dessus.png"> 
        </div> `);
    })


    //// COMPORTEMENT DU TABLEAU DE JEU ////

    let j = 0, // indice du nombre de cartes retournées,
        // l'indice se réinitialise dès que 2 cartes sont retournées

        handicap = 0, // le handicap est le score, il s'incrémente 
        // à chaque retournement de carte sauf si une paire est trouvée

        paires_trouvees = 0;

    $(".dessus").on("click", function () {
        console.log(handicap)

        // la fonction s'éxecute uniquement lorsque moins de deux cartes sont retournées,
        // la réinitialisation de j dans les setTimeout() a pour conséquence de bloquer 
        // le retournement des cartes tant que l'animation de unflip() n'est pas exécutée
        if (j < 2) {
            backflip($(this).parent());
            j++;

            // recherche de paire 
            if (j == 2 && is_there_a_twin()) {
                handicap--; // le handicap est pardonné en cas de victoire (?)
                paires_trouvees++;

                // masquage des paires
                if (paires_trouvees < 8) {
                    setTimeout(function () {
                        $(".backfliped").parent().css("opacity", "0").off("click");
                        $(".backfliped").toggleClass("backfliped");
                        j = 0;
                    }, 500)
                } else {
                    setTimeout(function () {
                        // pop-up de victoire
                        if (confirm("Partie gagnée !\nRelancer une partie ?")) {
                            document.location.reload();
                        }
                    }, 500)
                }
            }

            // condition lorsque les deux cartes ne correspondent pas
            else if (j == 2) {
                // les cartes découvertes sont retournées
                setTimeout(function () {
                    unflip($(".backfliped").parent())
                    j = 0;
                }, 500)
                handicap++;
            } else { handicap++ }
        }
        // actualisation du score
        $("#handicap").text(handicap);
    })
})