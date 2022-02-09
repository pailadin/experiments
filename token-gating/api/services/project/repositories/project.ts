/* eslint-disable no-underscore-dangle */
import { Connection, Document, Schema } from 'mongoose';
import { injectable } from 'inversify';
import {
  ID,
  Project,
} from '../../../types';
import Repository from '../../../library/repository';

type ProjectDocument = Document<ID> & Project;

@injectable()
export default class ProjectRepository
  extends Repository<
  Project,
    Pick<Project, 'name' | 'description' | 'contractAddress' | 'discordId' | 'discordChannel'> &
     Partial<Pick<Project, 'createdAt' | 'updatedAt'>>,
    Partial<Pick<Project, 'id' | 'name' | 'description' | 'contractAddress' | 'discordId' | 'discordChannel' |
     'createdAt' | 'updatedAt'>>
  > {
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
      discordId: {
        type: String,
        required: true,
      },
      discordChannel: {
        type: String,
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
}
