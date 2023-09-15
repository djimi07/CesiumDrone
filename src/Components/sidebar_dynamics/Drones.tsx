import { Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useSelector, useDispatch } from 'react-redux';
import { set_ovenplayer } from '../../actions/set_ovenplayer';


function Drones()
{

    const entities = useSelector((state:any) => state.entities);
    const ovenplayer = useSelector((state:any) => state.ovenplayer);
 
    const dispatch = useDispatch();
    

    const getTooltip = (tooltipText:string) => {
        return <Tooltip id="tooltip">{tooltipText}</Tooltip>;
    };

    function handleDroneCardClick(serial:string)
    {
        dispatch(set_ovenplayer(serial));
    }

    console.log('drone rendered')

    return (<>

        <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className='accordion_head_span'>Drones</span> <i className='fas fa-angle-up'></i> </Accordion.Header>
                <Accordion.Body>
                    {entities.length > 0 ? <>

                        {entities.map((entity:any) =>{
                            return <div key={entity.serial} onClick={()=>handleDroneCardClick(entity.serial)} className='drone_card_div mt-2' style={(ovenplayer.entity == entity.serial) ? {borderBottom: '2px rgb(92 157 186) solid'} : {}}>

                            <div className='serial_status_div d-flex'>
                                <span>{entity.serial.substr(entity.serial.length - 5)}</span>
                                <OverlayTrigger placement="top"  overlay={getTooltip(entity.payload.data.battery.capacity_percent + ' %')}>
                                    <div className="batteryContainer">
                                        <div className="batteryOuter">
                                            <span>{entity.payload.data.battery.capacity_percent + ' %'}</span>
                                            <div id="batteryLevel" style={{width:entity.payload.data.battery.capacity_percent+'%'}}></div>
                                        </div>
                                        <div className="batteryBump"></div>
                                    </div>
                                </OverlayTrigger>
                            </div>

                            <div className='infos_drone_div'>
                                <table className='table table-borderless'><tbody><tr><td><span><i className='fas fa-mountain'></i> Height </span></td><td className='text-right'><span>{Math.trunc(entity.payload.data.height)}</span></td></tr></tbody></table>
                            </div>

                            <div className='infos_drone_div'>
                                <table className='table table-borderless'><tbody><tr><td><span><i className='fas fa-arrows-rotate'></i> Heading </span></td><td className='text-right'><span>{Math.trunc(entity.payload.gimbal_yaw)}</span></td></tr></tbody></table>
                            </div>

                            <div className='infos_drone_div'>
                                <table className='table table-borderless'><tbody><tr><td><span><i className='fas fa-mountain'></i> Height </span></td><td className='text-right'><span>{Math.trunc(entity.payload.data.height)}</span></td></tr></tbody></table>
                            </div>
                        </div>
                        })}

                        

                    </> : <span className='accordion_body_span'>No drone actif</span>}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    

    
    
    </>)

}

export default Drones;