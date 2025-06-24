import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'
import router from '@/router'
import { io } from 'socket.io-client'
import { useToast } from 'vue-toastification'
import { nextTick } from 'vue'
import { useGroupStore } from './GroupsStore.js'

export const useGroupMemberStore = defineStore('GroupMember', () => {
  const groupMemberByGroupIdList = ref([])
  const groupMemberByUserIdList = ref([])

  const toast = useToast()

  const group = useGroupStore()

  const groupMemberLeaveGroupById = async (group_id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/groupMemberleaveGroup/${group_id}`,
        { withCredentials: true },
      )

      if (response.status === 201) {
        toast.success('Succesfully left the group!')
        group.groupsUserJoinedList = group.groupsUserJoinedList.filter(
          (group) => group.group_id !== group_id,
        )
      }
    } catch (error) {
      console.error('Failed leaving the group.')
    }
  }

  const groupMemberBanByid = async (user_id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/groupMemberBan/${user_id}`)

      if (response.status === 201) {
        toast.success('Succesfully banned from the group!')
      }
      groupMemberByGroupIdList.value = groupMemberByGroupIdList.value.filter(
        (user) => user.user_id !== user_id,
      )
    } catch (error) {
      console.error('Failed banning the groupmember.')
    }
  }

  const groupMemberPost = async (user_id, group_id) => {
    try {
      const response = await axios.post('http://localhost:5000/groupmembers', { user_id, group_id })

      if (response.status === 201) {
        toast.success('Succesfully added to your group!')
      }

      groupMemberByUserIdList.value = groupMemberByUserIdList.value.filter(
        (group) => group.group_id !== group_id,
      )
    } catch (error) {
      console.error('Failed posting a groupmember.')
    }
  }

  const groupMembersGetByGroupId = async (group_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/groupmembersByGroupId/${group_id}`)
      groupMemberByGroupIdList.value = response.data
    } catch (error) {
      console.error('no group member:')
    }
  }

  const groupMembersGetByUserId = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/groupmembersByUserId`, {
        withCredentials: true,
      })
      groupMemberByUserIdList.value = response.data
    } catch (error) {
      console.error('Failed getting ')
    }
  }

  return {
    groupMemberLeaveGroupById,
    groupMemberBanByid,
    groupMemberByUserIdList,
    groupMemberByGroupIdList,
    groupMemberPost,
    groupMembersGetByUserId,
    groupMembersGetByGroupId,
  }
})
