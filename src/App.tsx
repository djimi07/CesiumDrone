
import {  useRef, useState, useEffect } from 'react'

import './App.css'

import { Viewer, CameraFlyTo, ImageryLayer, CesiumComponentRef, CustomDataSource, Entity, BillboardGraphics, CesiumMovementEvent, EventTarget} from "resium";
import { Cartesian3, UrlTemplateImageryProvider, Credit, OpenStreetMapImageryProvider, Viewer as CesiumViewer, ImageryLayer as ImageryLayerCesium, Cartesian2, createWorldImageryAsync, IonWorldImageryStyle, Entity as CesiumEntity, SceneTransforms } from "cesium";
import * as mqtt from 'mqtt';
import OvenPlayer from 'ovenplayer';
import MenuBar from './Components/MenuBar';
import { add_or_update_entity } from './actions/add_or_update_entity';
import { useDispatch, useSelector } from 'react-redux';
import Drone from './assets/drone.png';

function App() {

  //Cesium Viewer instance captured here
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);

  //get entities state from redux
  const entities = useSelector((state:any) => state.entities);

  //Make ref for entities state redux
  const DronesCollection = useRef<any>(null);
      

  //List of tagged layers (use identifiers of your choice)
  const imageryList:string[] = [
    'Mieurne Mono',
    'Street Map',
    'Bing maps arial',
    'Bing Maps Aerial with Labels',
    'Bing Maps Road'
  ]

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
function changeLayer(layer:string)
{
  const viewer:any = ref.current?.cesiumElement;

  //viewer?.entities.collectionChanged.addEventListener(function(e:any){console.log(e)})

  viewer?.imageryLayers.removeAll();

  switch (layer) {

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
function EntityToolTip(entity?:CesiumEntity)
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
                            tooltip.innerHTML = '<span class=\'tooltip_span\'>' + entity._id +'</span>';
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

  
},[])

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

        <CameraFlyTo once={true} destination={position} orientation={orientation}/>
        <MenuBar changeLayer={changeLayer} imageryList={imageryList}/>
    </Viewer>

    { <MqttComponent/> }
    {/*<OvenPlayerComponent/>*/}
    </>
  )
}



function MqttComponent()
{
    const [client, setClient] = useState<any>(null);
    const [connected, setConnected] = useState<boolean>(false);

    const dispatch = useDispatch();
    
    //const connectUrl = 'wss://broker.emqx.io:8084/mqtt';
    const connectUrl = 'wss://unmannedar.com/mqttws';
    

    /*const options : { clean:boolean, connectTimeout:number, clientId:string, username:string, password:string   } = {
        // Clean session
        clean : true,
        connectTimeout: 4000,
        // Authentication
        clientId: 'emqx_test',
        username: 'emqx_test',
        password: 'emqx_test',
    };*/


    const options = {
      clean: true,
      connectTimeout: 4000,
    }

    const mqttConnect = async () => {

      const clientMqtt = await mqtt.connect(connectUrl, options);
      setClient(clientMqtt);
      setConnected(true);

    }

    useEffect(() => {
      
      if (client) { 

          client.on('connect', () => {
          console.log('Connected')
          client.subscribe('thing/product/+/osd', function (err:any) {
              if (!err) {
                   //client.publish('thing/product/1581F5FHD232N0034DFFF/osd', 'payload')
                 }
                 else
                 {
                  console.log(err);
                 }
              })
          });

          client.on('error', (error:any) => {
              console.log('Connection failed:', error)
          });
    

          client.on('reconnect', () => {
              console.log('reconnecting:...')
          });

          client.on('message', (topic:string, message:any) => {

              //console.log('receive message：', topic, message.toString());
              if (topic.includes("15")) {
                  const parts = topic.split('/')
                  const serial = parts[2];
                  decodeandset(serial,message.toString());
              }
          })

      } 

    }, [connected]);

    
    function decodeandset(serial:string, payload:string)
    {
      const telm:any = JSON.parse(payload);
      let gimbal_yaw = 0;
      for (const key in telm.data)
      {
         if (telm.data[key].gimbal_yaw !== undefined)
         {
             gimbal_yaw = Math.trunc(telm.data[key].gimbal_yaw);
             telm.gimbal_yaw = gimbal_yaw;
             break;
         }
      }

      //resium react allow dynamic rendering so no need to call viewer instance to add entities
      //dispatch the payload received into the reducer// reducer will handle logics
      dispatch(add_or_update_entity({serial:serial, payload:telm}))
      
    }


    useEffect(() => {

      mqttConnect();

    }, []);


    return (<> </>)
} 





 function OvenPlayerComponent()
{
  
  const player = OvenPlayer.create('vp', {
    autoStart: true,
    autoFallback:true,
    controls:false,
    mute:true,
    webrtcConfig: {
      timeoutMaxRetry:4,
      connectionTimeout:3000
    },
    hlsConfig: {
      liveSyncDuration: 1.5,
      liveMaxLatencyDuration:3,
      maxLiveSyncPlaybackRate:1.5
    },
    sources: [
        {
            type: 'webrtc',
            file: 'wss://unmannedar.com/lhsswss/+key'
        }
    ],
  })
      //player.debug(true);

      player.getConfig().systemText.api.error[501].message = 'No Stream. Checking in 10 seconds';
      player.getConfig().systemText.api.error[511].message = 'No Stream. Checking in 10 seconds';
      player.getConfig().systemText.api.error[512].message = 'No Stream.';
      
      player.on('error', () => {
          //setTimeout(function(){ location.reload(); }, 10000);
      });

  return <></>
} 

export default App
