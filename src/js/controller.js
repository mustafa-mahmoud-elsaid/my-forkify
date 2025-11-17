import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultView.update(model.getResultsPerPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);

  } catch (error) {
    recipeView.renderError()
    console.log(error);
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();

    // 1) Get query
    const query = searchView.getQuery();
    if (!query) {
      resultView.renderError();
      return;
    }

    // 2) Load search result
    await model.loadSearchResult(query);

    // 3) Render result
    // console.log(model.state.search.results);
    resultView.render(model.getResultsPerPage());

    // 4) Render pagination view
    paginationView.render(model.state.search);

  } catch (error) {
    recipeView._clear();
    resultView._clear();
    console.error(error);
  }
};

const controlPagination = function (goto) {
  resultView.render(model.getResultsPerPage(goto));
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};
const controlBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addUpdatingServingsHandler(controlServings);
  recipeView.addBookmarkHandler(controlAddBookmark);
  bookmarksView.addHandlerRender(controlBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
};

init();