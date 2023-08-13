import entities from './entities.tsx';
import layersReducer from './layers.tsx';



import { combineReducers } from 'redux';


const allReducers = combineReducers({

    entities: entities,
    layers:layersReducer,

})

export default allReducers;
