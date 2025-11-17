import View from "./View";
import icons from 'url:../../img/icons.svg';
class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');
    addHandlerClick(handler) {
        this._parentElement.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn--inline');
            if (!btn) return;
            const goto = +btn.dataset.goto;
            handler(goto);
        })
    }
    _generateHtml() {
        const currPage = this._data.page;
        const noPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
        // Page 1, and others
        if (currPage === 1 && noPages > 1) {
            return `
                <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                    <span>Page ${currPage + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>
            `;
        }
        // last page
        if (currPage === noPages && noPages > 1) {
            return `
                <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${currPage - 1}</span>
                </button>
            `;
        }
        // Page 1, No others 'only one page' 
        if (currPage === 1 && noPages === 1) {
            return '';
        }

        // middle
        return `
            <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}.svg#icon-arrow-left"></use>
                </svg>
                <span>Page ${currPage - 1}</span>
            </button>
            <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
                <span>Page ${currPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }
}
export default new PaginationView();