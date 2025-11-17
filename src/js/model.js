import { API_URL, RES_PER_PAGE } from './config.js';
import { getJson } from './helpers.js';
export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],
};

export const loadRecipe = async function (id) {
    try {
        if (state.bookmarks.some(r => r.id === id)) {
            state.recipe = state.bookmarks.find(r => r.id === id);
            state.recipe.bookmarked = true;
            return;
        }
        const data = await getJson(`${API_URL}/${id}`);
        let { recipe } = data.data
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
            bookmarked: false,
        };

        // console.log(recipe);
    } catch (error) {
        // alert(error);
        console.error(error);
        throw error;
    }
};

export const loadSearchResult = async function (query) {
    try {
        state.search.query = query;
        const data = await getJson(`${API_URL}?search=${query}`)
        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
            }
        });

    } catch (error) {
        throw error;
    }
};

export const getResultsPerPage = function (page = 1) {
    state.search.page = page;
    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;
    return state.search.results.slice(start, end);
};
export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = ing.quantity * (newServings / state.recipe.servings);

    });
    state.recipe.servings = newServings;
};
export const addBookmark = function (recipe) {
    state.bookmarks.push(recipe);
    if (recipe.id === state.recipe.id)
        state.recipe.bookmarked = true;
};
export const removeBookmark = function (id) {
    const idx = state.bookmarks.findIndex(r => r.id === id);
    state.bookmarks.splice(idx, 1);
    if (id === state.recipe.id)
        state.recipe.bookmarked = false;
};