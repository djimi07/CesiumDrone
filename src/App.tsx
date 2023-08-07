  


import { useState, useEffect } from 'react'

import './App.css'

import {  Cartesian3, UrlTemplateImageryProvider, Credit, WebMapServiceImageryProvider, Viewer, ImageryLayer, DefaultProxy } from "cesium";
import * as mqtt from 'mqtt';
import MenuBar from './Components/MenuBar';
import Cookies from 'js-cookie';

//import OvenPlayer from 'ovenplayer';

function App() {
  
  const [entities, setEntities] = useState<any>([]);
  const [viewer, setViewer] = useState<any>();

  //const [selectedImagery, setSelectedImagery] = useState<any>('UrlTemplateImageryProvider');
  
  const imageryList:string[] = [
    'UrlTemplateImageryProvider',
    'WebMapServiceImageryProvider'
  ];

  function addImagery()
  {

    const m_mono:any = new WebMapServiceImageryProvider({
      url : 'https://sampleserver1.arcgisonline.com/ArcGIS/services/Specialty/ESRI_StatesCitiesRivers_USA/MapServer/WMSServer',
      layers : '0'
    });

    const imageryLayer =  ImageryLayer.fromProviderAsync(m_mono, {});
  

  viewer.imageryLayers.removeAll();

  }

  useEffect(()=>{

    if (document.querySelector('.cesium-viewer') == null)
    {
      const m_mono:any = new UrlTemplateImageryProvider({
        url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
        credit: new Credit(
            "Maptiles by <a href='http://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
        ),
      });
  
      const viewerInstance = new Viewer('map', {
          baseLayerPicker: false,
          geocoder: false,
          homeButton: false,
          timeline: false,
          animation: false,
          baseLayer: ImageryLayer.fromProviderAsync(m_mono,{}),
          
      })
  
      viewerInstance.camera.flyTo({
        destination: Cartesian3.fromDegrees(139.5, 33.0, 100000.0),
        orientation: {
            pitch: -0.3,
            roll: -0.25,
        },
      });

      setViewer(viewerInstance);

      }
    
}, []);


  return (<>

        <MenuBar imageryList={imageryList}  addImagery={addImagery}/>

        <MqttComponent entities={entities} setEntities={setEntities}/> 
        {/*<OvenPlayerComponent/>*/}
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
                  console.log(props)
                  if (props.entities.filter((entity:string) => entity == entityId).length == 0)
                  {
                    props.setEntities([...props.entities, entityId]);
                  }
               
              }
                  //display entity
          })

      } 

    }, [connected]);
    

    useEffect(() => {

      mqttConnect();

    }, []);


    return (<> </>)
} 





{/*function OvenPlayerComponent()
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
*/}
export default App
