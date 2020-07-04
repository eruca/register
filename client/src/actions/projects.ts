import { GET_PROJECTS } from './../constants/projects';
import { IAction } from './base';

export function getProjects(projects: string[]): IAction {
    return {
        type: GET_PROJECTS,
        payload: projects,
    };
}
