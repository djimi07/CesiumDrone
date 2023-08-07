

import {  useRef, useState, useEffect } from 'react'

import './App.css'

import { Viewer, CameraFlyTo, ImageryLayer, CesiumComponentRef, Entity, CustomDataSource} from "resium";
import { Cartesian3, UrlTemplateImageryProvider, Credit, Color, OpenStreetMapImageryProvider, Viewer as CesiumViewer, ImageryLayer as ImageryLayerCesium } from "cesium";
import * as mqtt from 'mqtt';
import OvenPlayer from 'ovenplayer';
import MenuBar from './Components/MenuBar';

function App() {

  //Cesium Viewer instance captured here
  const ref = useRef<CesiumComponentRef<CesiumViewer>>(null);

  //Save entities here (drones)
  const [entities, setEntities] = useState<any>([]);

  //List of tagged layers (use identifiers of your choice)
  const imageryList:string[] = [
    'layer1',
    'layer2'
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
  const viewer = ref.current?.cesiumElement;

  viewer?.imageryLayers.removeAll();

  switch (layer) {

    case 'layer1':{
      const imageryProvider = new UrlTemplateImageryProvider({
        url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        credit: new Credit("Maptiles by <a href='http://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL.")
      });
    
        viewer?.imageryLayers.addImageryProvider(imageryProvider)
      break;
    }

    case 'layer2':{
        const imageryLayer = new ImageryLayerCesium(new OpenStreetMapImageryProvider({
            url: "https://tile.openstreetmap.org/"
        }), {})

    viewer?.imageryLayers.add(imageryLayer);
      break;
    }
  
    default:
      break;
  }
}
console.log(entities)

  return (<>

    <Viewer ref={ref} full baseLayerPicker={false} geocoder={false} homeButton={false} timeline={false} animation={false}>
        <ImageryLayer imageryProvider={imageryProvider}/> 

        
          {entities.length > 0 ? <> 

          <CustomDataSource name='drones'> {/* same as entity Collection */}
          
          {entities.map((entity:any,i:number) => {

            return <Entity key={i} 
                           name={entity}
                           description={"EntityId " + entity + "</br> </br> Futur Drone Feed"}
                           position={Cartesian3.fromDegrees(139, 35.0, 1000)}
                           point={{ pixelSize: 30, color:Color.BLUE }} /> 
                   })
          }
          
          </CustomDataSource>
            
           </> : null}

        <CameraFlyTo once={true} destination={position} orientation={orientation}/>
        <MenuBar changeLayer={changeLayer} imageryList={imageryList}/>
    </Viewer>

    { <MqttComponent entities={entities} setEntities={setEntities}/> }
    {<OvenPlayerComponent/>}
    </>
  )
}



function MqttComponent(props:any)
{
    const [client, setClient] = useState<any>(null);
    const [connected, setConnected] = useState<boolean>(false);
    
    const connectUrl = 'wss://broker.emqx.io:8084/mqtt';

    const options : { clean:boolean, connectTimeout:number, clientId:string, username:string, password:string   } = {
        // Clean session
        clean : true,
        connectTimeout: 4000,
        // Authentication
        clientId: 'emqx_test',
        username: 'emqx_test',
        password: 'emqx_test',
    };

    const mqttConnect = async () => {

      const clientMqtt = await mqtt.connect(connectUrl, options);
      setClient(clientMqtt);
      setConnected(true);

    }

    useEffect(() => {
      
      if (client) { 
        console.log('salut')

          client.on('connect', () => {
          console.log('Connected')
          client.subscribe('thing/product/+/osd', function (err:any) {
              if (!err) {
                   client.publish('thing/product/1581F5FHD232N0034DFFF/osd', 'payload')
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

              console.log('receive message：', topic, message.toString());
              if (topic.includes("15")) {
                  const parts = topic.split('/')
                  const entityId = parts[2];
                  // test if entityId already present

                  if (props.entities.filter((entity:string) => entity == entityId).length == 0)
                  {
                    //Dispatch the new entity into viewer
                    props.setEntities([...props.entities, entityId]);
                  }
                  else
                  {
                    //EntityId already existed on viewer, we should just update payload data....

                  }
              }
          })

      } 

    }, [connected]);
    

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
