
import {   useEffect } from 'react';



import OvenPlayer from 'ovenplayer';

import {  useSelector } from 'react-redux';



function OvenPlayerComponent()
{

  const entities = useSelector((state:any) => state.entities);

  const players_container = document.getElementById('players_container');

  function createPlayer(id:string)
  {
      const player = OvenPlayer.create(id, {
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
              //file: 'wss://unmannedar.com/lhsswss/+key'
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

      if (entities.length > 0)
      {
          entities.forEach((entity:any) => {

             if (!document.getElementById('vp_'+entity.serial))
             {
               const wrapper = document.createElement("div");
                     wrapper.className = "player-wrapper";
                     wrapper.innerHTML = "<div id=vp_"+ entity.serial +"> </div>";

                players_container?.appendChild(wrapper);

               createPlayer('vp_'+entity.serial);
             }

          });
      }

  },[entities.length])


 
  return null;
} 


export default OvenPlayerComponent;