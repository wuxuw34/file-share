import { defineConfig ,loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig((mode:any)=>{
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define:{
      VITE_BASE_URL:JSON.stringify(env.VITE_BASE_URL)
    },
    plugins: [vue(),
      vueJsx(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })],
      server:{
        host:'0.0.0.0'
      },
      css:{
        preprocessorOptions:{
          scss:{
            additionalData:'@import "./src/variables.scss";'
          }
        }
      }
  }
})
