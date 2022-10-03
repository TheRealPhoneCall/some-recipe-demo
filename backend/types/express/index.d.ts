declare namespace Express {
  interface Request {
    payload?: any;
    pageIdx?: {
      startIdx: number;
      endIdx: number;
    };
    pagination?: {
      next?: { page: number; limit: number; };
      previous?: { page: number; limit: number; };
      docsCount: number;
    };
    file?: any;
    addedDoc?: any;
    updatedDoc?: any;
    deletedDoc?: any;
  }
}