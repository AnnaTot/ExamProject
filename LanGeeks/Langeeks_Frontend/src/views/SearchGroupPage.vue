<template>
  <div class="pageContainer">
    <div class="container">
      <div class="row">
        <div class="col-xl-6 col-sm-12 leftSide">
          <h1>The Groups that you are in:</h1>
          <form @submit.prevent>
            <div class="card" v-for="group in groups.groupsUserJoinedList" :key="group.group_id">
              <div class="card-body">
                {{ group.groupname }}

                <button  src="../assets/images/pencil-square.svg"
                  @click="WriteTotheGroup(group)"
                  title="write">
                  write
                </button>
                <button @click="leaveTheGroup(group)">Leave</button>
              </div>
            </div>
            <div class="card" v-for="group in groups.groupsByAdminList">
              <div class="card-body">
                As Admin {{ group.groupname }}
                <button  src="../assets/images/pencil-square.svg"
                  alt=""
                  @click="WriteTotheGroup(group)"
                  title="write">
                  write
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="col-xl-6 col-sm-12 rightSide">
          <h1>Search for groups</h1>

          <div>
            <input
              v-model="inputByUser"
              type="text"
              id="language"
              placeholder="Search by groupname"
            />
          </div>

          <div class="cardsContainer">
            <div v-for="group in searchForGroups" :key="group.group_id">
              <div v-show="!groups.groupsByAdminList.find((c) => c.group_id === group.group_id)">
                <div
                  class="card"
                  v-show="
                    !groupMember.groupMemberByUserIdList.find((c) => c.group_id === group.group_id)
                  "
                >
                  <div class="card-body">
                    <img src="../assets/images/people-fill.svg" />

                    {{ group.groupname }}

                    <img
                      src="../assets/images/envelope-arrow-up-fill.svg"
                      title="send request"
                      class="penIcon"
                      style="margin-left: 20px"
                      @click="askForPremission(group)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="../assets/css/searchGroup_css.css" scoped></style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUsersStore } from '@/stores/UserStore.js'
import { useGroupStore } from '@/stores/GroupsStore.js'
import { useSocketStore } from '@/stores/SocketStore.js'
import { useNotificationsStore } from '@/stores/NotificationsStore.js'
import { useGroupMemberStore } from '@/stores/GroupMembersStore.js'
import router from '@/router'

const inputByUser = ref('')
const notification = useNotificationsStore()
const groupMember = useGroupMemberStore()
const groups = useGroupStore()
const users = useUsersStore()
const socket = useSocketStore()

socket.socket

groups.getAllGroups()

onMounted(() => {
  groupMember.groupMembersGetByUserId()
  groups.groupsUserJoined()
  groups.getGroupsByAdmin()
})

const askForPremission = async (group) => {

  await groups.groupAdminsUsername(group?.groupadmin_id)

  socket.sendRequestToGroup(
    users.LoggedInUser.username,
    groups.adminUsername.username,
    group.group_id,
    group.groupadmin_id,
    group.groupname,
  )
}

const searchForGroups = computed(() => {
  const inputByUserLowerletter = inputByUser.value.toLowerCase()

  if (inputByUser.value === '') {
    return groups.getAllTheGroupsList
  } else {
    return groups.getAllTheGroupsList.filter((group) =>
      group.groupname.toLowerCase().includes(inputByUserLowerletter),
    )
  }
})

const leaveTheGroup = (group) => {
  groupMember.groupMemberLeaveGroupById(group.group_id)
}

const WriteTotheGroup = (group) => {
  users.chosenGroup(group)
}
</script>
