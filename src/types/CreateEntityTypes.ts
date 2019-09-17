import { ClassIdInputType } from './ClassIdType';
import ClassId from '../srml-types/versioned-store/ClassId';

export type CreateEntityInputType = {
  classId: ClassIdInputType
}

export type CreateEntityOutputType = {
  class_id: ClassId
}