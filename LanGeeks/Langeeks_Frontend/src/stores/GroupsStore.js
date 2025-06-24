import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'
import { io } from 'socket.io-client'
import { useToast } from 'vue-toastification'

export const useGroupStore = defineStore('groupStore', () => {
  const getAllTheGroupsList = ref([])
  const groupsUserJoinedList = ref([])
  const groupsByAdminList = ref([])
  const onlyGroupname = ref([])
  const adminUsername = ref('')
  const toast = useToast()

  const getAllGroups = async () => {
    try {
      const response = await axios.get('http://localhost:5000/groups')
      getAllTheGroupsList.value = response.data
    } catch (error) {
      console.error('Getting the group failed!')
    }
  }

  const createGroupPost = async (groupname) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/groups',
        { groupname },
        { withCredentials: true },

        
      )


      if (response.status == 201) {
        toast.success('Successfully created a group!')
        groupsByAdminList.value.push(response.data.group[0])
    
        console.log(groupname)
          console.log(groupsByAdminList.value)
          console.log(response.data)
           console.log(response.data.group[0])
      }

    } catch (error) {

      if (error.status === 403) {
        toast.error('You have reached the limit!')
      }

      if (error.status === 400) {
        toast.error(`The  group name is already taken.`)
      }

      console.error('Create a group failed:')
    }
  }

  const deleteCreatedGroups = async (group_id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/groupsDelete/${group_id}`)

      if (response.status === 201) {
        toast.success('Group succesfully deleted!')
      }

    } catch (error) {
      console.error('Error deleting group')
    }
  }

  const getGroupsByAdmin = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/groupAdmin`, {
        withCredentials: true,
      })
      groupsByAdminList.value = response.data
    } catch (error) {
      console.error('Getting the group failed!')
    }
  }

  const groupsUserJoined = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/groupsUserin`, {
        withCredentials: true,
      })
      groupsUserJoinedList.value = response.data
    } catch (error) {
      console.error('Getting the groups failed!')
    }
  }

  const groupnameGetBygroupId = async (group_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/groupnameByid/${group_id}`)
      onlyGroupname.value = response.data

    } catch (error) {
      console.error('error')
    }
  }

  const groupAdminsUsername = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/groupAdminName/${id}`)
      adminUsername.value = response.data

    } catch (error) {
      console.error('error')
    }
  }

  return {
    groupsByAdminList,
    getAllGroups,
    getAllTheGroupsList,
    createGroupPost,
    deleteCreatedGroups,
    getGroupsByAdmin,
    groupsUserJoinedList,
    groupsUserJoined,
    groupnameGetBygroupId,
    onlyGroupname,
    groupAdminsUsername,
    adminUsername,
  }
})
