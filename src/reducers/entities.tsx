interface Entity {
    serial?: string; 
    payload?:any;
}

const entitiesReducer = (state:Entity[] =[] , action:any) => {

    const state_copy = [...state];
    //console.log(state);

    switch(action.type){

        case 'add_or_update_entity' : {

            const serial = action.payload.serial;

            const entity_check:any = state.filter((state) => state.serial == serial);

            if (entity_check.length > 0)
            {
                console.log('entity update...')

                const entities_copy:any = state_copy;

                for (let i = 0; i < entities_copy.length; i++)
                { 
                    if (entities_copy[i].serial == entity_check[0].serial)
                    {
                        entities_copy[i].payload = action.payload.payload;
                    }
                }

                
                
            
                return entities_copy;
            }
            else
            {
                return [...state, action.payload];
            }
            
        }
            
        default :
            return state;
    }

}


export default entitiesReducer;