class SearchView {
    #parentEle = document.querySelector('.search');
    #clearInput() {
        this.#parentEle.querySelector('.search__field').value = '';
    }
    getQuery() {
        const query = this.#parentEle.querySelector('.search__field').value;
        this.#clearInput();
        return query;
    }
    addHandlerSearch(handler) {
        this.#parentEle.addEventListener('submit', (e) => {
            e.preventDefault();
            handler();
        });
    }
}
export default new SearchView();