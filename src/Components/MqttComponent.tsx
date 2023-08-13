
import {   useState, useEffect } from 'react'

import * as mqtt from 'mqtt';

import { add_or_update_entity } from '../actions/add_or_update_entity';
import { useDispatch } from 'react-redux';


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


export default MqttComponent;