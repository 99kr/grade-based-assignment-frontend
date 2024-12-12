import { openDetailPage } from '../index.js'
import { addFavorite, createLoader, isFavorite, mapRawCocktailData, removeFavorite } from '../utilities.js'

let foundResults = []
let currentPage = 0
let maxPages = 0

export default function SearchPage() {
    // reset
    foundResults = []
    currentPage = 0
    maxPages = 0

    const searchPage = html`
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

                <div id="pagination-numbers" class="flex gap-2"></div>

                <button id="pagination-forward" class="pagination-button" disabled>
                    <span class="material-symbols-rounded">chevron_right</span>
                </button>
            </div>

            <p id="results-count">Showing 1-10 of ${foundResults.length} results</p>
        </div>
    `

    mainElement.innerHTML = searchPage

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

    searchResultsElement.addEventListener('click', ({ target }) => {
        if (!target.dataset.id) return
        const id = target.dataset.id

        if (target.tagName === 'BUTTON' && target.dataset.favorited !== null) {
            const favorited = target.dataset.favorited === 'true'
            const cocktail = getFoundCocktailFromId(id)
            if (!cocktail) return

            if (favorited) {
                target.dataset.favorited = 'false'
                target.classList.remove('btn-primary')
                removeFavorite(id)
            } else {
                target.dataset.favorited = 'true'
                target.classList.add('btn-primary')
                addFavorite(cocktail)
            }
            return
        }

        if (target.tagName !== 'LI') return

        openDetailPage(id)
    })
}

function paginatedSearchResults() {
    const searchResultsElement = mainElement.querySelector('#search-results')
    const resultsCountElement = mainElement.querySelector('#results-count')

    const startIdx = currentPage * 10
    let endIdx = startIdx + 10
    if (endIdx > foundResults.length) endIdx = foundResults.length

    searchResultsElement.innerHTML = foundResults.slice(startIdx, endIdx).map(createSearchResult).join('')

    const paginationNumbers = mainElement.querySelector('#pagination-numbers')
    paginationNumbers.innerHTML = PaginationNumbers()

    const paginationBack = mainElement.querySelector('#pagination-back')
    const paginationForward = mainElement.querySelector('#pagination-forward')
    const currentPageButton = paginationNumbers.querySelector(`[data-page="${currentPage}"]`)

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

    paginationNumbers.onclick = (event) => {
        if (event.target.tagName !== 'BUTTON') return
        currentPage = Number(event.target.dataset.page)
        paginatedSearchResults()
    }

    if (foundResults.length === 0) {
        searchResultsElement.innerHTML = html`<p class="text-zinc-400">No results found</p>`
    }

    resultsCountElement.innerHTML = `Showing ${startIdx + 1}-${endIdx} of ${foundResults.length} results`
}

function PaginationNumbers() {
    return Array.from({ length: maxPages })
        .map((_, i) => html`<button class="pagination-button" data-page="${i}">${i + 1}</button>`)
        .join('')
}

function createSearchResult(cocktail) {
    let favorited = isFavorite(cocktail.id)

    return html`
        <li class="flex justify-between hover:bg-zinc-700 rounded-md p-2 cursor-pointer" data-id="${cocktail.id}">
            <div class="flex items-center gap-4 pointer-events-none">
                <img
                    src="${cocktail.thumbnail}"
                    alt="${cocktail.name}"
                    class="size-10 rounded-md pointer-events-none"
                />
                <p class="text-lg pointer-events-none">${cocktail.name}</p>
            </div>

            <button
                class="btn favorite-btn px-2 py-0 justify-self-end ${favorited ? 'btn-primary' : ''}"
                data-favorited="${favorited}"
                data-id="${cocktail.id}"
            >
                <span class="material-symbols-rounded text-xl pointer-events-none">star</span>
            </button>
        </li>
    `
}

function getFoundCocktailFromId(cocktailId) {
    return foundResults.find((cocktail) => cocktail.id === cocktailId)
}

// General function for searching cocktails API, since the API doesn't support a single request for all search types
// and then mapping the results to a more usable format
async function searchCocktailsAndMap(url) {
    try {
        const results = await fetch(BASE_URL + url).then((response) => response.json())

        if (!results || !results.drinks || !Array.isArray(results.drinks)) return []
        return results.drinks.map(mapRawCocktailData)
    } catch {
        return []
    }
}

async function getSearchResults(search) {
    if (!search || search.trim().length === 0) return []

    const nameResults = await searchCocktailsAndMap(`/search.php?s=${search}`)
    const ingredientResults = await searchCocktailsAndMap(`/filter.php?i=${search}`)
    const categoryResults = await searchCocktailsAndMap(`/filter.php?c=${search}`)
    const glassResults = await searchCocktailsAndMap(`/filter.php?g=${search}`)

    return [...nameResults, ...ingredientResults, ...categoryResults, ...glassResults]
}
