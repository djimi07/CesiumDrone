const Layers:string[] = [
    'Mieurne Mono',
    'Street Map',
    'Bing maps arial',
    'Bing Maps Aerial with Labels',
    'Bing Maps Road'
  ]

const layersReducer = (state={list:Layers, picked:'Mieurne Mono'} , action:any) => {

    //console.log(state);

    switch(action.type){

        case 'change_layer':
            return {...state, picked:action.payload};
            
        default :
            return state;
    }
}

export default layersReducer;