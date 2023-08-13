import { useState } from 'react';
import { Accordion } from 'react-bootstrap';

import {  useDispatch, useSelector } from 'react-redux';
import { pick_layer } from '../../actions/pick_layer';


function Layers()
{
    const layers = useSelector((state:any) => state.layers);

    //for color optimization and fast updating
    const [Locallayer, setLocalLayer] = useState(layers.picked);

    const dispatch = useDispatch();

    function layerPicked(layer:string)
    {
        setLocalLayer(layer);
        dispatch(pick_layer(layer));
    }

    return (<>

        <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className='accordion_head_span'>Layers</span> <i className='fas fa-angle-up'></i> </Accordion.Header>
                <Accordion.Body>
                    {layers.list.length > 0 ? <>

                        <div className='accordion_body_list'>
                            {layers.list.map((layer:string,i:number)=>{
                                return <span key={i} onClick={()=>layerPicked(layer)} className={'accordion_body_span list ' + ((layer == Locallayer) ? 'picked' : '')}>{layer}</span>;
                            })}
                        </div>

                    </> :
                    
                    <span className='accordion_body_span'>Empty layers</span>}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    
    
    
    </>)

}

export default Layers;