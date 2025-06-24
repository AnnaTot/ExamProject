import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'
import { io } from 'socket.io-client'
import { useToast } from 'vue-toastification'
import { useUsersStore } from './UserStore.js'
import { useNotificationsStore } from './NotificationsStore.js'

export const useSocketStore = defineStore('socket', () => {
  const socket = ref(null)
  const onlineUsers = ref([])

  const toastRequest = ref(null)
  const toestBanned = ref(null)

  const accpetedRequest = ref(null)
  const deniedRequest = ref(null)

  const toast = useToast()

  const notific = useNotificationsStore()

  socket.value = io('http://localhost:3000')


  const connectSocket = () => {
    socket.value.on('userOnline', (username) => {
      onlineUsers.value.push(username)
      console.log(onlineUsers.value)
    })
  }

  const userLoginToSocket = (username) => {
    socket.value.emit('userLogin', username)
  }

  const sendRequestToGroup = (
    loged_username,
    groupAdminUsername,
    group_id,
    groupadmin_id,
    groupName,
  ) => {
    toastRequest.value = {
      message: `${loged_username} would like to join your ${groupName} group.`,
    }
    notific.notificationsPost(group_id, groupadmin_id, toastRequest.value.message)

    socket.value.emit('Group Request', groupAdminUsername, toastRequest.value)
  }

  const receiveRequestFromUser = () => {
    socket.value.on('Recieve request', (toastRequest, logedUser_id, group_id) => {
      notific.notificationsGetById()

      const sent_by = notific.notificationsByIdList.find((c) => c.sent_to_group)?.sent_to_group

      const sent_to_group = notific.notificationsByIdList.find(
        (c) => c.sent_to_group,
      )?.sent_to_group

      if (toastRequest !== null) {
        if (!(sent_by && sent_to_group)) {
          toast(`${toastRequest.message}`)
        } else {
          console.log('nem az első üzenet')
        }
      }
    })
  }

  const offlineUsers = (username) => {

    socket.value.emit('userOffline register', username)
    console.log(onlineUsers.value )


    
    socket.value.on('userOffline',(username)=>{
    onlineUsers.value = onlineUsers.value.filter((user) => user !== username)
    console.log(onlineUsers.value )



    })
    
  }

  const userBannedByAdmin = (username, groupName, groupAdminName, group_id) => {
    toestBanned.value = {
      message: `You are banned from the ${groupName} group by ${groupAdminName} admin.`,
    }

    socket.value.emit('Banned user', username, toestBanned.value, group_id)
  }

  const userGetBannedMessage = () => {
    const group = useUsersStore()

    socket.value.on('Banned user send', (toestBanned, group_id) => {

      if (toestBanned !== null) {

        toast.warning(`${toestBanned.message}`)

        if (group.group_?.group_id === group_id) {
          router.push('/myPage')

          toast.warning(`${toestBanned.message}`)
        }
      }
    })
  }

  const acceptedRequestSend = (groupAdminName, groupName, username) => {
    accpetedRequest.value = {
      messeage: ` ${groupAdminName} accepted your request to join ${groupName} group`,
    }

    socket.value.emit('accepted request', accpetedRequest.value, username)
  }

  const acceptedRequestArrive = () => {
    socket.value.on('sent from backend', (accpetedRequest) => {

      if (accpetedRequest !== null) {
        toast.success(accpetedRequest.messeage)
      }
    })
  }

  const deniedRequestSend = (groupAdminName, groupName, username) => {
    deniedRequest.value = {
      messeage: ` ${groupAdminName} denied your request to join ${groupName} group`,
    }
    socket.value.emit('denied request', deniedRequest.value, username)
  }

  const deniedRequestArrived = () => {
    socket.value.on('send denied request', (deniedRequest) => {

      if (deniedRequest !== null) {
        toast.warning(deniedRequest.messeage)
      }
    })
  }

  return {
    userLoginToSocket,
    connectSocket,
    onlineUsers,
    sendRequestToGroup,
    receiveRequestFromUser,
    offlineUsers,
    userBannedByAdmin,
    userGetBannedMessage,
    acceptedRequestSend,
    deniedRequestSend,
    deniedRequestArrived,
    acceptedRequestArrive,
  }
})
