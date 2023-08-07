import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import cesium from 'vite-plugin-cesium';

import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import nodePolyfills from "rollup-plugin-polyfill-node";

// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react(), cesium()],

  resolve: {
    alias: {
      util: "util/",
    }
  },

  optimizeDeps: {
        esbuildOptions: {
            // Node.js global to browser globalThis
            define: {
                global: 'globalThis'
            },
            // Enable esbuild polyfill plugins
            plugins: [
              NodeGlobalsPolyfillPlugin({
                buffer: true,
                process: true,
              }),
            ],
        }
    },
    build: {
      rollupOptions: {
        // Enable rollup polyfills plugin
        // used during production bundling
        plugins: [nodePolyfills()],
      },

      
  },

})
