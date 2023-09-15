

const ovenPlayerReducer = (state={entity:''} , action:any) => {

    //console.log(state);

    switch(action.type){

        case 'play':
            return {...state, entity:action.payload};
            
        default :
            return state;
    }
}

export default ovenPlayerReducer;