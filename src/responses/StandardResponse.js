class StandardResponse {
    constructor(status, data, messages, exception) {
        this.Status = status;
        this.Data = data;
        this.Messages = messages;
        this.Exception = exception;
    }
}

class PaginationData {
    constructor(totalItems, currentPage, totalPage, data) {
        this.TotalItems = totalItems;
        this.CurrentPage = currentPage;
        this.TotalPage = totalPage;
        this.Data = data;
    }
}

export { StandardResponse, PaginationData };
