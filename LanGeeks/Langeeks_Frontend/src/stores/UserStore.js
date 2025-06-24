import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import router from '@/router'
import {useSocketStore} from './SocketStore.js'

export const useUsersStore = defineStore('userStore', () => {
  const usersAllGetList = ref([])
  const userGetByIdList = ref([])
  const selectedUser = ref(null)
  const selectedGroup = ref(null)

  const isGoodLogin = ref(true)
  const LoggedInUser = ref({})
  const isLoggedIn = ref(false)
  const toast = useToast()
  const socket = useSocketStore()

  const usersAllGet = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users', { withCredentials: true })
      usersAllGetList.value = response.data
    } catch (error) {
      console.error('Failed getting all the users!')
    }
  }

  const userGetById = async (user_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${user_id}`)
      userGetByIdList.value = response.data
    } catch (error) {
      console.error('Getting one user failed')
    }
  }

  const chosenUser = (user) => {
    selectedUser.value = user

    if (selectedGroup.value) {
      selectedGroup.value = null
    }

    router.push('messagePage')
  }

  const chosenGroup = (group) => {
    selectedGroup.value = group

    if (selectedUser.value) {
      selectedUser.value = null
    }
    router.push('messagePage')
  }

  const registertUser = async (username, password, email, language_id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/register`,
        { username, password, email, language_id },
        { withCredentials: true },
      )



      if (response.status == 201) {
        toast.success('Register was succesful!')
        router.push('/myPage')
        isLoggedIn.value = true
        LoggedInUser.value = response.data.user
      }
    } catch (error) {

      if(error.status === 500)
      {
          toast.error('Register failed!')
      }


      if (error.status === 400) {
        toast.warning('Choose a different email or username!')
      }

    
      console.error('Registration failed.')
    }
  }

  const logUser = async (username, password) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/login`,
        { username, password },
        { withCredentials: true },
      )


      if (response.status == 200) {
        router.push('/myPage')

        isGoodLogin.value = true
        LoggedInUser.value = response.data.user
        isLoggedIn.value = true
        socket.userLoginToSocket(LoggedInUser.value.username)
 
      }
    } catch (error) {


      if (error.status === 404 || error.status === 401 || error.status === 400) {
        isGoodLogin.value = false

      }

      if (error.status === 403) {
        toast.error(`You are banned for ${error.response.data.bannedTime}`)
      }

      if (error.status === 500) {
        toast.error(`Server error`)
        console.log(error.response)
      }
    }
  }

  const userLoggedInCheck = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/userLoggedinCheck`, {
        withCredentials: true,
      })

      

      if (response.status === 201) {
        isLoggedIn.value = true
        console.log(response.data.user.username)
        LoggedInUser.value = response.data.user
        router.push('myPage')

      }
    } catch (error) {
      isLoggedIn.value = false
     router.push('/')

      console.error('Check user is loged in failed.')
    }
  }

  const logoutUser = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/logout',
        {},
        { withCredentials: true },
      )

      if (response.status === 200) {
        socket.offlineUsers(LoggedInUser.username)
        router.push('/')
        console.log(response.data)
      }
    } catch (error) {
      console.error('Logging out failed.')
    }
  }

  return {
    logoutUser,
    usersAllGet,
    usersAllGetList,
    userGetById,
    userGetByIdList,
    chosenGroup,
    chosenUser,
    logUser,
    isLoggedIn,
    LoggedInUser,
    isGoodLogin,
    registertUser,
    userLoggedInCheck,
    selectedGroup,
    selectedUser,
  }
})
