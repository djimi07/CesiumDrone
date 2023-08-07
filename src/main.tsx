import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

/*
  useEffect(()=>{

    const m_mono: any = new UrlTemplateImageryProvider({
      url: 'https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',
      credit: new Credit(
          "Maptiles by <a href='http://mierune.co.jp' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
      ),
    });

    const viewer = new Viewer('map', {
        baseLayerPicker: false,
        geocoder: false,
        homeButton: false,
        timeline: false,
        animation: false,
        baseLayer: ImageryLayer.fromProviderAsync(m_mono,{}),
      
    })

    viewer.camera.flyTo({
      destination: Cartesian3.fromDegrees(139.5, 33.0, 100000.0),
      orientation: {
          pitch: -0.3,
          roll: -0.25,
      },
  });
  */