import { AuthorRepository, AuthorRepositoryFactory } from '../repositories/author';
import {
    IAcessByIndexParams,
    ICreateRequest,
    IDeleteRequest,
    IListRequest,
    IListResponse,
    INoResponse,
    IReadRequest,
    IReplaceRequest,
    ISingleResponse,
    IUpdateRequest,
} from './interfaces';
import { ICreateAuthor, IReadAuthor, IUpdateAuthor } from '../../domain/dependency_inversion/author';
import { IHandler, INextFunction, IRouter } from '../dependency_inversion/api';

class AuthorController {
    private authorRepositoryFactory: AuthorRepositoryFactory;

    constructor(router: IRouter, authorRepositoryFactory: AuthorRepositoryFactory) {
        this.authorRepositoryFactory = authorRepositoryFactory;

        router.get('/authors', this.list.bind(this) as IHandler);
        router.post('/authors', this.create.bind(this) as IHandler);
        router.get('/authors/:id', this.read.bind(this) as IHandler);
        router.put('/authors/:id', this.replace.bind(this) as IHandler);
        router.patch('/authors/:id', this.update.bind(this) as IHandler);
        router.delete('/authors/:id', this.delete.bind(this) as IHandler);
    }

    public async list(
        req: IListRequest<unknown, unknown>,
        res: IListResponse<IReadAuthor>,
        next: INextFunction,
    ): Promise<void> {
        const authorRepository = this.authorRepositoryFactory.getInstance();
        try {
            const authors = await authorRepository.findAll();
            res.status(200).json(authors);
        } catch (error: unknown) {
            await next.call(error as Error);
        }
    }

    public async create(
        req: ICreateRequest<unknown, ICreateAuthor>,
        res: ISingleResponse<IReadAuthor>,
        next: INextFunction,
    ): Promise<void> {
        const authorRepository: AuthorRepository = this.authorRepositoryFactory.getInstance();
        try {
            const newAuthor = await authorRepository.create(req.getBody());
            res.status(201).json(newAuthor);
        } catch (error: unknown) {
            await next.call(error as Error);
        }
    }

    public async read(
        req: IReadRequest<IAcessByIndexParams>,
        res: ISingleResponse<IReadAuthor>,
        next: INextFunction,
    ): Promise<void> {
        const authorRepository: AuthorRepository = this.authorRepositoryFactory.getInstance();
        const id = req.getParams().id;
        try {
            const author = await authorRepository.findById(id);
            if (author) {
                res.status(200).json(author);
            } else {
                res.status(404).json({ message: 'Author not found' });
            }
        } catch (error: unknown) {
            await next.call(error as Error);
        }
    }

    public async replace(
        req: IReplaceRequest<IAcessByIndexParams, ICreateAuthor>,
        res: ISingleResponse<IReadAuthor>,
        next: INextFunction,
    ): Promise<void> {
        const authorRepository: AuthorRepository = this.authorRepositoryFactory.getInstance();
        const id = req.getParams().id;
        try {
            const updatedAuthor = await authorRepository.replace(id, req.getBody());
            res.status(200).json(updatedAuthor);
        } catch (error: unknown) {
            await next.call(error as Error);
        }
    }

    public async update(
        req: IUpdateRequest<IAcessByIndexParams, IUpdateAuthor>,
        res: ISingleResponse<IReadAuthor>,
        next: INextFunction,
    ): Promise<void> {
        const authorRepository: AuthorRepository = this.authorRepositoryFactory.getInstance();
        const id = req.getParams().id;
        try {
            const updatedAuthor = await authorRepository.update(id, req.getBody());
            if (updatedAuthor) {
                res.status(200).json(updatedAuthor);
            } else {
                res.status(404).json({ message: 'Author not found' });
            }
        } catch (error: unknown) {
            await next.call(error as Error);
        }
    }

    public async delete(
        req: IDeleteRequest<IAcessByIndexParams>,
        res: INoResponse,
        next: INextFunction,
    ): Promise<void> {
        const authorRepository = this.authorRepositoryFactory.getInstance();
        const id = req.getParams().id;
        try {
            await authorRepository.delete(id);
            res.status(204).send();
        } catch (error: unknown) {
            await next.call(error as Error);
        }
    }
}

export default AuthorController;