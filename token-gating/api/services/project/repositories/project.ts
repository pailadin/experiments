/* eslint-disable no-underscore-dangle */
import { Connection, Document, Schema } from 'mongoose';
import { injectable, inject } from 'inversify';
import {
  ID,
  Project,
  TYPES,
} from '../../../types';
import Repository, { FilterQuery } from '../../../library/repository';

import baseRetrievePage from '../../../library/retrieve-page';
import ObjectId from '../../../library/object-id';

type ProjectDocument = Document<ID> & Project;

@injectable()
export default class ProjectRepository
  extends Repository<
  Project,
    Pick<Project, 'name' | 'description' | 'contractAddress' | 'discordGuild' | 'discordChannel' |
    'discordRoleId' | 'adminAccount'> &
     Partial<Pick<Project, 'createdAt' | 'updatedAt'>>,
    Partial<Pick<Project, 'id' | 'name' | 'description' | 'contractAddress' | 'discordGuild' | 'discordChannel' |
    'discordRoleId' | 'adminAccount' | 'createdAt' | 'updatedAt'>>
  > {
    @inject(TYPES.retrievePage) private readonly baseRetrievePage!: typeof baseRetrievePage;

    async getModel(db: Connection) {
      const schema = new Schema<ProjectDocument>({
        _id: {
          type: Buffer,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
        contractAddress: {
          type: String,
          required: true,
        },
        discordGuild: {
          type: String,
          required: true,
        },
        discordChannel: {
          type: String,
          required: true,
        },
        discordRoleId: {
          type: String,
          required: true,
        },
        adminAccount: {
          type: Buffer,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },

      }, { id: false, _id: false });

      schema.virtual('id').get(function (this: ProjectDocument) {
        return Buffer.from(this._id as never);
      });

      schema.index({ createdAt: 1 });

      return db.model<ProjectDocument>('Project', schema);
    }

    async retrievePage(params: {
    first?: number | null;
    after?: Buffer | null;
    sortDirection?: 'ASC' | 'DESC';
    cursorKey?: string;
    filter?: FilterQuery<Project>,
  }) {
      return this.baseRetrievePage<Project, ProjectDocument>(
        await this.model,
        params,
        {
          transform: (document) => {
            const obj = this.serializeObject(document);

            return Object.assign(obj, {
              id: new ObjectId(obj.id).toString(),
            });
          },
        },
      );
    }
}
