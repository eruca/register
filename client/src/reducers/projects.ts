import { GET_PROJECTS } from './../constants/projects';
import { IAction } from './../actions/base';

export type IProjects = string[];

const INIT_STATE: IProjects = [];

export default function projects(state = INIT_STATE, action: IAction): IProjects {
    switch (action.type) {
        case GET_PROJECTS:
            console.log('Get Projects:', action);

            return action.payload as string[];
        default:
            return state;
    }
}
