<script setup lang="ts">

import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUiStore } from 'src/stores/ui-store'

interface ITab {
  name: string;
  label: string;
  tooltip: string;
  color?: string;
  link?: string;
  disabled?: boolean;
  icon: string;
}

const uiStore = useUiStore()
const footerTab = ref('home')
const router = useRouter()
const tabs: ITab[] = [
  { name: 'recipes', label: 'Recipes', tooltip: 'Recipes', link: '/recipes', icon: 'fa-solid fa-bowl-food' },
  { name: 'favorites', label: 'Favorites', tooltip: 'Favorites', link: '/recipes/favorites', icon: 'favorite' },
  { name: 'account', label: 'Me', tooltip: 'Account', link: '/account', icon: 'fa-solid fa-user' }
]

function setTab (tab: ITab) {
  footerTab.value = tab.name
  if (tab.link) {
    router.push(tab.link)
  }
}

const route = useRoute()
console.log('MainLayout', route, route.name)

</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header
      elevated
      class="bg-primary text-white"
      height-hint="98"
      style="overflow: hidden;"
    >
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          Some Recipes
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container
      style="overflow: scroll; -webkit-overflow-scrolling: touch;"
    >
      <suspense>
        <router-view />
      </suspense>
      <!-- <ar-fab-btn /> -->

    </q-page-container>
    <q-footer
      elevated
      class="bg-blue-grey-13 text-white"
      style="overflow: hidden;"
      v-if="uiStore.navFooterShow && !['sign-in', 'sign-up'].includes($route.name as string)"
    >
      <q-toolbar class="row justify-center q-pa-none">
        <div class="fit row wrap justify-center">
          <transition-group
            :class="$q.screen.gt.xs ? 'col-9' : 'col-12'"
            leave-active-class="animated zoomOut"
            tag="div"
          >
            <q-tabs
              v-model="footerTab"
              key="tabs"
              dense
              class="fit row wrap items-start items-center content-start q-pa-none"
            >
              <q-tab
                v-for="tab in tabs"
                :key="`tab-${tab.name}`"
                no-caps
                :class="`col q-pt-xs ${tab.color ? `text-${tab.color}` : ''}`"
                :color="tab.color"
                :name="tab.name"
                :label="tab.label"
                :tooltip="tab.tooltip"
                :icon="tab.icon"
                :disable="tab.disabled"
                @click="setTab(tab)"
              />
            </q-tabs>
          </transition-group>
        </div>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>
