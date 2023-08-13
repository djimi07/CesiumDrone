import { Accordion, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { useSelector } from 'react-redux';


function Drones()
{

    const entities = useSelector((state:any) => state.entities);
    

    const getTooltip = (tooltipText:string) => {
        return <Tooltip id="tooltip">{tooltipText}</Tooltip>;
    };

    console.log('drone rendered')

    return (<>


        <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header><span className='accordion_head_span'>Drones</span> <i className='fas fa-angle-up'></i> </Accordion.Header>
                <Accordion.Body>
                    {entities.length > 0 ? <>

                        <div className='drone_card_div' style={{    borderBottom: '2px rgb(92 157 186) solid'}}>

                            <div className='serial_status_div d-flex'>
                                <span>drone-15</span>
                                <OverlayTrigger placement="top"  overlay={getTooltip('13%')}>
                                    <div className="batteryContainer">
                                        <div className="batteryOuter">
                                            <span>13%</span>
                                            <div id="batteryLevel" style={{width:'80%'}}></div>
                                        </div>
                                        <div className="batteryBump"></div>
                                    </div>
                                </OverlayTrigger>
                            </div>

                            <div className='infos_drone_div'>
                                <table className='table table-borderless'><tbody><tr><td><span><i className='fas fa-mountain'></i> Height </span></td><td className='text-right'><span>300</span></td></tr></tbody></table>
                            </div>

                            <div className='infos_drone_div'>
                                <table className='table table-borderless'><tbody><tr><td><span><i className='fas fa-arrows-rotate'></i> Heading </span></td><td className='text-right'><span>-100</span></td></tr></tbody></table>
                            </div>

                            <div className='infos_drone_div'>
                                <table className='table table-borderless'><tbody><tr><td><span><i className='fas fa-mountain'></i> Height </span></td><td className='text-right'><span>300</span></td></tr></tbody></table>
                            </div>
                        </div>

                    </> : <span className='accordion_body_span'>No drone actif</span>}
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    

    
    
    </>)

}

export default Drones;