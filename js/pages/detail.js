import { mapRawCocktailData } from '../utilities.js'

const mainElement = document.querySelector('main')

export default async function DetailPage(cocktailId) {
    const cocktail = await getCocktailFromId(cocktailId)
    const instructions = cocktail.instructions.split('.')
    // remove last instruction (empty string)
    instructions.splice(-1, 1)

    const html = `
    <div class="flex gap-16">
        <div class="flex flex-col gap-8">
            <div>
                <p class="text-zinc-400">${cocktail.category}</p>
                <h1 class="text-4xl">${cocktail.name}</h1>
            </div>

            <img src="${cocktail.thumbnail}" alt="${cocktail.name}" class="size-96 rounded-md" />

            <ul class="flex flex-wrap gap-2 max-w-96">
                ${cocktail.tags.map(createTag).join('')}
            </ul>
        </div>
        
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-2">
                <h2 class="text-2xl">Ingredients</h2>
                <ul class="flex flex-col gap-2 list-disc list-inside">
                    ${cocktail.ingredients.map(createIngredient).join('')}
                </ul>
            </div>

            <div class="flex flex-col gap-2">
                <h2 class="text-2xl">Instructions</h2>
                <ul class="flex flex-col gap-2 list-disc list-inside">
                    ${instructions.map(createInstruction).join('')}
                    ${createInstruction('Served with: ' + cocktail.glass)}
                </ul>
        </div>
    </div>`

    mainElement.innerHTML = html
}

function createTag(text) {
    return `<li class="bg-zinc-600 text-zinc-100 px-4 rounded-full text-sm">${text}</li>`
}

function createIngredient(ingredient) {
    return `
    <li class="text-zinc-200 pl-2">
        ${ingredient.ingredient}
        ${ingredient.measure ? `(${ingredient.measure.trimEnd()})` : ''}
    </li>`
}

function createInstruction(instruction) {
    return `<li class="text-zinc-200 pl-2">${instruction}</li>`
}

async function getCocktailFromId(cocktailId) {
    const cocktail = await fetch(BASE_URL + `/lookup.php?i=${cocktailId}`).then((response) => response.json())
    return mapRawCocktailData(cocktail.drinks[0])
}