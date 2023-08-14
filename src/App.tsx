
import {  useRef, useEffect } from 'react'

import './assets/css/App.css'

import { Viewer, CameraFlyTo, ImageryLayer, CesiumComponentRef, CustomDataSource, Entity, BillboardGraphics} from "resium";
import { Cartesian3, UrlTemplateImageryProvider, Credit, OpenStreetMapImageryProvider, Viewer as CesiumViewer, ImageryLayer as ImageryLayerCesium, Cartesian2, createWorldImageryAsync, IonWorldImageryStyle, SceneTransforms } from "cesium";

import {  useSelector } from 'react-redux';

import Drone from './assets/drone.png';
import OvenPlayerComponent from './Components/OvenPlayerComponent';
import MqttComponent from './Components/MqttComponent';
import Layout from './Layout';
import { Tooltip, Overlay } from 'react-bootstrap';

function App() {

  //Cesium Viewer instance captured here
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);

  //get entities state from redux
  const entities = useSelector((state:any) => state.entities);
  const layers = useSelector((state:any) => state.layers);

  //Make ref for entities state redux
  const DronesCollection = useRef<any>(null);
      
  

  //Initiate default Layer
  const imageryProvider = new UrlTemplateImageryProvider({
    url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
    credit: new Credit("Maptiles by <a href='http://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.")
  });
  
  const position = Cartesian3.fromDegrees(139.5, 33.0, 100000.0);

  const orientation = { 
      pitch: -0.3,
      roll:-0.25 
  };
  //----------------------//

//Function callback that handle layer changing
function changeLayer()
{
  const viewer:any = ref.current?.cesiumElement;

  //viewer?.entities.collectionChanged.addEventListener(function(e:any){console.log(e)})

  viewer?.imageryLayers.removeAll();

  switch (layers.picked) {

    case 'Mieurne Mono':{
      const imageryProvider = new UrlTemplateImageryProvider({
        url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        credit: new Credit("Maptiles by <a href='http://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.")
      });
    
        viewer?.imageryLayers.addImageryProvider(imageryProvider)
      break;
    }

    case 'Street Map':{
        const imageryLayer = new ImageryLayerCesium(new OpenStreetMapImageryProvider({
            url: "https://tile.openstreetmap.org/"
        }), {})

        viewer?.imageryLayers.add(imageryLayer);
      break;
    }

    case 'Bing maps arial':{
        try{
          (async()=>{
            const imagery_provider:any = await createWorldImageryAsync();
            viewer.imageryLayers.addImageryProvider(imagery_provider)
          })()
        }
        catch
        {
          break;
        }
        break;
      }
      case 'Bing Maps Aerial with Labels':{
        try{
          (async()=>{
            const imagery_provider:any = await createWorldImageryAsync({style: IonWorldImageryStyle.AERIAL_WITH_LABELS});
            viewer.imageryLayers.addImageryProvider(imagery_provider)
          })()
        }
        catch
        {
          break;
        }
        break;
      }
      case 'Bing Maps Road':{
        try{
          (async()=>{
            const imagery_provider:any = await createWorldImageryAsync({style: IonWorldImageryStyle.ROAD});
            viewer.imageryLayers.addImageryProvider(imagery_provider)

            /*const osm_buildings:any = await createOsmBuildingsAsync();
            viewer.scene.primitives.add(osm_buildings)*/

          })()
        }
        catch
        {
          break;
        }
        break;
      }
    default:
      break;
  }
}

//Function callback that Tooltip displaying on entities
function EntityToolTip()
{
    if (ref.current && ref.current.cesiumElement && DronesCollection && DronesCollection.current)
    {
        const viewer = ref.current.cesiumElement;

        if (viewer.container.getAttribute('listener') != 'true')
        {
            viewer.container.setAttribute('listener', 'true');

            const scratch3dPosition = new Cartesian3();
            const scratch2dPosition = new Cartesian2();

            console.log('event fired')

            viewer.clock.onTick.addEventListener(function(clock) {

                const entities:any = DronesCollection.current.cesiumElement._entityCollection._entities._array;

                //console.log(entities)

                if (entities.length > 0)
                {
                    entities.forEach((entity:any) => {
                        let position3d;
                        let position2d;

                        //check if tooltip already exist
                        let tooltip = document.getElementById(entity._id);
                        let isEntityVisible = true;

                        if (!tooltip)
                        {
                            tooltip = document.createElement('div');
                            tooltip.innerHTML = '<span data-bs-toggle="tooltip" data-bs-placement="top" title="This is a tooltip" class=\'tooltip_span\'>' + entity._id +'</span>';
                            tooltip.id = entity._id;
                            tooltip.className = 'tooltip_div';
                            viewer.container.appendChild(tooltip);
                        }
                    
                        if (entity.position)
                        {
                            position3d = entity.position.getValue(clock.currentTime, scratch3dPosition);
                        }

                        if (position3d)
                        {
                            position2d = SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, position3d, scratch2dPosition);
                        }

                        if (position2d)
                        {
                            // entity present in map
                            tooltip.style.left = (position2d.x + 10) + 'px';
                            tooltip.style.top = (position2d.y - 40) + 'px';
                      
                            // Reveal HTML when entity comes on screen
                            if (!isEntityVisible)
                            {
                                isEntityVisible = true;
                                tooltip.style.display = 'block';
                            }
                        }
                        else if (isEntityVisible)
                        {
                            // Hide HTML when entity goes off screen or loses its position.
                            isEntityVisible = false;
                            tooltip.style.display = 'none';
                        }
                    
                  });
                }
            })
        }  
}

    else
    {
        console.log('Event not fired')
        setTimeout(EntityToolTip,1000);
    }
  
}

useEffect(()=>{

  EntityToolTip();

},[]);

useEffect(()=>{
  changeLayer();

}, [layers.picked])


const tooltip = <Tooltip> hi </Tooltip>


  return (<>

    <Viewer ref={ref} full baseLayerPicker={false} geocoder={false} homeButton={false} timeline={false} animation={false}>
        <ImageryLayer imageryProvider={imageryProvider}/> 

        
          {entities.length > 0 ? <> 

          <CustomDataSource ref={DronesCollection} name='Drones'> {/* same as entity Collection */}
          
          {entities.map((entity:any,i:number) => {

            return <Entity key={i}
                          name={entity.serial.substr(entity.serial.length - 5)}
                          id={entity.serial}
                          description={"Timestamp:"+entity.payload.timestamp+ "<br>Height:"+entity.payload.data.elevation+ "<br>Battery:"+entity.payload.data.battery.capacity_percent+ "<br>Heading:"+entity.payload.gimbal_yaw}
                          position={Cartesian3.fromDegrees(entity.payload.data.longitude, entity.payload.data.latitude, entity.payload.data.elevation)}
                          > 
                          <BillboardGraphics image={Drone} scale={0.1} />
                    </Entity> 
                   })
          }
          
          </CustomDataSource>
            
           </> : null}

        {/*<CameraFlyTo once={true} destination={position} orientation={orientation}/>*/}

        <Layout/>

        <Overlay target={document.getElementById('players_container')} show={true} placement="top">
        <Tooltip id="overlay-example">
            My Tooltip
        </Tooltip>
    </Overlay>

    </Viewer>

    { <MqttComponent/> }
    {<OvenPlayerComponent/>}

    

    </>
  )
}



export default App
