import entities from './entities.tsx';



import { combineReducers } from 'redux';


const allReducers = combineReducers({

    entities: entities,

})

export default allReducers;
