import entities from './entities.tsx';
import layersReducer from './layers.tsx';
import ovenPlayerReducer from './ovenplayer.tsx';



import { combineReducers } from 'redux';


const allReducers = combineReducers({

    entities: entities,
    layers:layersReducer,
    ovenplayer:ovenPlayerReducer,

})

export default allReducers;
