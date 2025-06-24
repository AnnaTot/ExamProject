import "bootstrap/dist/css/bootstrap.min.css"
import "vue-toastification/dist/index.css"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUsersStore } from './stores/UserStore.js'
import {useSocketStore} from './stores/SocketStore.js'
import { onMounted } from "vue"
import { useNotificationsStore } from '@/stores/NotificationsStore.js';


import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'

const app = createApp(App)


const options = {
    position: "top-right",
    timeout: 5000,
    closeOnClick: true
}






app.use(createPinia())
app.use(router)





const logged = useUsersStore()
const useSoc = useSocketStore()
const notific = useNotificationsStore()


logged.isLoggedIn
useSoc.onlineUsers
useSoc.socket
useSoc.receiveRequestFromUser()
useSoc.userGetBannedMessage()
useSoc.acceptedRequestArrive()
useSoc.deniedRequestArrived()
logged.userLoggedInCheck()


const socketLogin = useSocketStore()

app.use(Toast, options)




useSoc.connectSocket()
useSoc.userLoginToSocket(logged.LoggedInUser.username)
useSoc.socket





  



app.mount('#app')
