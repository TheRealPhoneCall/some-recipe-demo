<script setup lang="ts">

import { toRef } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '../store'
import { useUiStore } from 'src/stores/ui-store'
import { useLinks } from 'src/components/use/links'
import EditProfile from './EditProfile.vue'

interface IAccountItem {
  isHeader?: boolean;
  icon?: string;
  label: string;
  subtext?: string;
  onClick?: any;
  onToggle?: any;
  isConnected?: boolean;
  isNew?: boolean
}

const authStore = useUserAuthStore()
// const businessStore = useBusinessStore()
const uiStore = useUiStore()
const user = toRef(authStore, 'authedUser')
const router = useRouter()
const { getUrl } = useLinks()
const rating = 5

const accountItems: IAccountItem[] = [
  {
    label: 'Edit Profile',
    icon: 'account_box',
    onClick: () => { uiStore.editProfileDialog = true }
  }

]

const socmedItems: IAccountItem[] = [
  {
    label: 'Facebook',
    icon: 'fa-brands fa-facebook-f',
    isConnected: false,
    onToggle: () => true
  },
  {
    label: 'Google',
    icon: 'fa-brands fa-google',
    isConnected: false,
    onToggle: () => true
  }
]

const miscItems: IAccountItem[] = [
  {
    label: 'Logout',
    icon: 'logout',
    onClick: () => {
      authStore.signOut()
      router.push('/auth/sign-in')
    }
  }
]

</script>

<template>
  <q-page>
    <q-item class="q-pa-md q-pb-xl">
      <q-item-section side>
        <q-avatar size="50px" rounded>
          <img :src="getUrl(user.photo?.path) || 'https://cdn.quasar.dev/img/boy-avatar.png'" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6 text-bold">{{ authStore.displayName }}</q-item-label>
        <q-item-label caption class="text-capitalize">{{ user.userType }}</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label class="text-bold text-primary">
          <!-- TODO: Give proper value for ratings -->
          <q-rating
            size="1rem"
            readonly
            v-model="rating"
            icon="star_border"
            icon-selected="star"
            color="primary"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-space />
    <div class="text-bold q-pa-md text-primary">Account Profile</div>
    <q-list separator bordered>
      <q-item
        v-for="(item, idx) of accountItems"
        :key="idx"
        clickable
        @click="item.onClick()"
      >
        <q-item-section side>
          <q-icon :name="item.icon" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
          <q-item-label
            v-if="item.subtext"
            caption
            class="text-capitalize"
          >{{ item.subtext }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <br />
    <div class="text-bold q-pa-md text-primary">Linked Accounts</div>
    <q-list separator bordered>
      <q-item
        v-for="(item, idx) of socmedItems"
        :key="idx"
        clickable
        @click="item.onToggle()"
      >
        <q-item-section side>
          <q-icon :name="item.icon" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
          <q-item-label
            v-if="item.subtext"
            caption
            class="text-capitalize"
          >
            {{ item.subtext }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-toggle
            v-model="item.isConnected"
            @click="item.isConnected = !item.isConnected"
            checked-icon="check"
            color="primary"
            unchecked-icon="clear"
          />
        </q-item-section>
      </q-item>
    </q-list>
    <q-list separator bordered>
      <q-item
        v-for="(item, idx) of miscItems"
        :key="idx"
        clickable
        @click="item.onClick()"
      >
        <q-item-section side>
          <q-icon :name="item.icon" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
          <q-item-label
            v-if="item.subtext"
            caption
            class="text-capitalize"
          >{{ item.subtext }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <edit-profile />
    <business-account />
  </q-page>
</template>
