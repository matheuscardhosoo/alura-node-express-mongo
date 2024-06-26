import { IAdaptersError } from '../errors';

export class RepositoryError extends Error implements IAdaptersError {
    public name = 'RepositoryError';

    public prevStack?: Error;

    public errors: { [path: string]: string } = {};

    constructor(message: string, prevStack?: Error) {
        super(message);
        this.prevStack = prevStack;
    }
}

export class DataValidatorError extends RepositoryError {
    public name = 'ValidationError';

    public errors: { [path: string]: string };

    constructor(errors: { [path: string]: string }, prevStack?: Error) {
        super('Validation error', prevStack);
        this.errors = errors;
    }
}

export class ResourceNotFoundError extends RepositoryError {
    public name = 'NotFoundError';

    public resourceName: string;

    public id?: string;

    constructor(resourceName: string, id?: string, prevStack?: Error) {
        super(`Resource not found: ${resourceName}`, prevStack);
        this.resourceName = resourceName;
        this.id = id;
    }
}
