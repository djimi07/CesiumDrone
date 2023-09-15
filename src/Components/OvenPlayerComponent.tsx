
import {   useEffect, useRef, useState } from 'react';
import { render, createPortal } from 'react-dom';

import OvenPlayer from 'ovenplayer';

import {  useSelector } from 'react-redux';



function OvenPlayerComponent()
{
    const [showTopCard, setShowTopCard] = useState(false);

    const entities = useSelector((state:any) => state.entities);
    const ovenplayer = useSelector((state:any) => state.ovenplayer);

    const ref = useRef(null)

    function runPlayer(entity:any)
    {
        //Create the top Block of each player
        // We need to manipulate the dom directly

        const playerWrapper = document.getElementById('player-wrapper');

        if (ref.current)
        {
            playerWrapper?.append(ref.current)
        }

        console.log(document.getElementsByClassName('top_box_player'));
   

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
                //type: 'webrtc',
                //file: 'wss://unmannedar.com/lhsswss/mood'
                type: 'dash',
                file: 'https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd'
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
  }

  useEffect(()=>{

      // test if entity always disponible on entities store
      if (entities.length > 0)
      {
          if (entities.filter((entity:any) => entity.serial == ovenplayer.entity).length > 0)
          {
              //get entity data
              const entity = entities.filter((entity:any) => entity.serial == ovenplayer.entity);

              // payload on entity must have stream key

            runPlayer(entity);
            
          }
      }

  },[ovenplayer.entity])

 
  return (<>
      <div id="ovenplayer_top_card_div" className={showTopCard ? '' : ''}>

        <div id="ovenplayer_top_card_header_div">
            <span>Drone-15-God-Eye</span>
            <span className='ml-auto'><i className='fas fa-times'></i></span>
        </div>

        <div id="ovenplayer_top_card_body_div">
            <div id="b1">
                <i className='fas fa-paper-plane'></i>
                <span className='mt-2'>ABCDE</span>
            </div>
            <div id='b2'>
                <span>Battery: 80%</span>
                <span>Speed: 30km/h</span>
                <span>wind: 80km/h</span>
                <span>Signal: 80%</span>
                <span>Wind speed: 1000 Km/h</span>
            </div>
        </div>

      </div>
  </>);

} 


export default OvenPlayerComponent;
