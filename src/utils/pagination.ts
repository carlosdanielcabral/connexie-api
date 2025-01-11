export type Pagination = {
    limit?: number;
    page?: number;
}

export const formatPagination = (filter: Pagination): Pagination => {
    const pagination: Pagination = { limit: 50000, page: 0 };

    if (filter.limit) {
        pagination.limit = filter.limit > 50000 ? 50000 : filter.limit;
    }

    if (filter.page) {
        pagination.page =  (filter.page - 1) * pagination.limit!;
    }

    return pagination;
}