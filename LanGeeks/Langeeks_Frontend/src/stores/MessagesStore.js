import { ref } from 'vue'
import axios from 'axios'
import { defineStore } from 'pinia'

export const useMessagesStore = defineStore('messageStore', () => {
  const messageGroupListByID = ref([])
  const messagePrivateListByID = ref([])

  const messagesPrivatePost = async (reciever, message) => {
    try {
      await axios.post(
        'http://localhost:5000/messagesPrivate',
        { reciever, message },
        { withCredentials: true },
      )
    } catch (error) {
      console.error('Failed posting a private message.')
    }
  }

  const messagesPrivateGetById = async (reciever_id) => {
    try {
      const response = await axios.get(`http://localhost:5000/messagesPrivate/${reciever_id}`, {
        withCredentials: true,
      })

      if (response.status === 200) {
        messagePrivateListByID.value = response.data
      }
    } catch (error) {
      if (error.status === 404) {
      }

      messagePrivateListByID.value = []
      messageGroupListByID.value = []

      console.error('Get all the private messages by id failed.')
    }
  }

  const messagesGroupPost = async (groupchat, message) => {
    try {
      await axios.post(
        'http://localhost:5000/messagesGroups',
        { groupchat, message },
        { withCredentials: true },
      )
    } catch (error) {
      console.error('Failed posting a group message.')
    }
  }

  const messagesGroupGetById = async (groupchat) => {
    try {
      const response = await axios.get(`http://localhost:5000/messagesGroup/${groupchat}`)
      messageGroupListByID.value = response.data
    } catch (error) {
      messageGroupListByID.value = []
      messagePrivateListByID.value = []

      console.error('Failed getting the group messages.')
    }
  }

  return {
    messagesGroupGetById,
    messageGroupListByID,
    messagesGroupPost,
    messagesPrivatePost,
    messagesPrivateGetById,
    messagePrivateListByID,
  }
})
