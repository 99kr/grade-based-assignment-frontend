import { openDetailPage } from '../index.js'
import { createLoader, mapRawCocktailData } from '../utilities.js'

const mainElement = document.querySelector('main')
let foundResults = []
let currentPage = 0
let maxPages = 0

export default function SearchPage() {
    // reset
    foundResults = []
    currentPage = 0
    maxPages = 0

    const html = `
    <div class="flex flex-col gap-8">
        <form id="search-form" class="w-full flex gap-2">
            <input class="w-full py-2 bg-zinc-700 rounded-md px-4" type="text" placeholder="Search" />
            <button class="btn-primary" type="submit">Search</button>
        </form>

        <ul class="flex flex-col gap-2" id="search-results"></ul>

        <div class="flex gap-2">
            <button id="pagination-back" class="pagination-button" disabled>
                <span class="material-symbols-rounded">chevron_left</span>
            </button>

            <div id="pagination-pages" class="flex gap-2"></div>

            <button id="pagination-forward" class="pagination-button" disabled>
                <span class="material-symbols-rounded">chevron_right</span>
            </button>
        </div>

        <p id="results-count">Showing 1-10 of ${foundResults.length} results</p>
    </div>`

    mainElement.innerHTML = html

    const input = mainElement.querySelector('#search-form input')
    input.focus()

    const searchResultsElement = mainElement.querySelector('#search-results')

    mainElement.querySelector('#search-form').addEventListener('submit', async (event) => {
        event.preventDefault()
        const searchTerm = input.value

        searchResultsElement.innerHTML = createLoader()

        const searchResults = await getSearchResults(searchTerm)

        foundResults = searchResults
        currentPage = 0
        maxPages = Math.ceil(searchResults.length / 10)

        paginatedSearchResults()
    })

    searchResultsElement.addEventListener('click', (event) => {
        if (event.target.tagName !== 'LI') return
        if (!event.target.dataset.id) return

        openDetailPage(event.target.dataset.id)
    })
}

function paginatedSearchResults() {
    const searchResultsElement = mainElement.querySelector('#search-results')
    const resultsCountElement = mainElement.querySelector('#results-count')

    const startIdx = currentPage * 10
    let endIdx = startIdx + 10
    if (endIdx > foundResults.length) endIdx = foundResults.length

    searchResultsElement.innerHTML = foundResults.slice(startIdx, endIdx).map(createSearchResult).join('')

    const paginationPages = mainElement.querySelector('#pagination-pages')
    paginationPages.innerHTML = createPaginationPages()

    const paginationBack = mainElement.querySelector('#pagination-back')
    const paginationForward = mainElement.querySelector('#pagination-forward')
    const currentPageButton = paginationPages.querySelector(`[data-page="${currentPage}"]`)

    paginationBack.disabled = currentPage === 0
    paginationForward.disabled = currentPage === maxPages - 1
    if (currentPageButton) currentPageButton.disabled = true

    paginationBack.onclick = () => {
        currentPage--
        paginatedSearchResults()
    }

    paginationForward.onclick = () => {
        currentPage++
        paginatedSearchResults()
    }

    paginationPages.onclick = (event) => {
        if (event.target.tagName !== 'BUTTON') return
        currentPage = Number(event.target.dataset.page)
        paginatedSearchResults()
    }

    if (foundResults.length === 0) {
        searchResultsElement.innerHTML = `<p class="text-zinc-400">No results found</p>`
    }

    resultsCountElement.innerHTML = `Showing ${startIdx + 1}-${endIdx} of ${foundResults.length} results`
}

function createPaginationPages() {
    return Array.from({ length: maxPages })
        .map((_, i) => `<button class="pagination-button" data-page="${i}">${i + 1}</button>`)
        .join('')
}

function createSearchResult(cocktail) {
    return `
    <li class="flex gap-4 items-center hover:bg-zinc-700 rounded-md p-2 cursor-pointer" data-id="${cocktail.id}">
        <img src="${cocktail.thumbnail}" alt="${cocktail.name}" class="size-10 rounded-md pointer-events-none" />
        <p class="text-lg pointer-events-none">${cocktail.name}</p>
    </li>
    `
}

async function getSearchResults(searchTerm) {
    const results = []

    // help D:
    try {
        const nameResults = await fetch(BASE_URL + `/search.php?s=${searchTerm}`).then((response) => response.json())

        if (Array.isArray(nameResults.drinks)) {
            for (const cocktail of nameResults.drinks) {
                results.push(mapRawCocktailData(cocktail))
            }
        }
    } catch {}

    try {
        const ingredientResults = await fetch(BASE_URL + `/filter.php?i=${searchTerm}`).then((response) =>
            response.json()
        )

        if (Array.isArray(ingredientResults.drinks)) {
            for (const cocktail of ingredientResults.drinks) {
                results.push(mapRawCocktailData(cocktail))
            }
        }
    } catch {}

    try {
        const categoryResults = await fetch(BASE_URL + `/filter.php?c=${searchTerm}`).then((response) =>
            response.json()
        )

        if (Array.isArray(categoryResults.drinks)) {
            for (const cocktail of categoryResults.drinks) {
                results.push(mapRawCocktailData(cocktail))
            }
        }
    } catch {}

    try {
        const glassResults = await fetch(BASE_URL + `/filter.php?g=${searchTerm}`).then((response) => response.json())

        if (Array.isArray(glassResults.drinks)) {
            for (const cocktail of glassResults.drinks) {
                console.log(cocktail)
                results.push(mapRawCocktailData(cocktail))
            }
        }
    } catch {}

    return results
}
