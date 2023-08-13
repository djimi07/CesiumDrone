import {  ReactElement, useState } from 'react';

import { Col, Row, Container } from 'react-bootstrap';
import Drones from './sidebar_dynamics/Drones';
import Layers from './sidebar_dynamics/Layers';

function SideBar()
{

    const [selectedIcon, setSelectedIcon] = useState<string>('planes');

    const icons:Icon[] = [
        {
            name: 'planes',
            class: 'fas fa-paper-plane',
            component: <Drones/>
        },
        {
            name: 'layers',
            class: 'fas fa-layer-group',
            component: <Layers/>
        },
        {
            name: 'globe',
            class: 'fas fas fa-globe',
            component: <Drones/>
        },
        {
            name: 'home',
            class: 'fas fa-home',
            component: <Drones/>
        }
    ]

    function ComponentToRender()
    {
        const componentToRender:any = icons.find((icon) => icon.name == selectedIcon)?.component;
        return componentToRender;
    }

    return (<>

        <Container id="side_bar_container">
            <Row>
                <Col xs={12} id='logo_col'>
                    <h3>Cesium<span style={{color:'#4895cc'}}>Drone</span></h3>
                </Col>
            </Row>
            <Row className="h-100">
                <Col xs={3} id="icons_col_sidebar">
                    <div id="icons_div_flex">
                        {icons.map((icon,i)=>{
                            return <span key={i} onClick={()=>setSelectedIcon(icon.name)} className={((selectedIcon == icon.name) ? 'clicked' : '')}> <i className={icon.class}></i> </span>
                        })}
                    </div>
                </Col>

                <Col xs={9} id="side_bar_dynamic_content">
                    <div id="dynamic_div">
                        {ComponentToRender()}
                    </div>
                </Col>
            </Row>
        </Container>
    </>)
}



interface Icon {
    name: string;
    class: string;
    component: ReactElement;
}


export default SideBar;
