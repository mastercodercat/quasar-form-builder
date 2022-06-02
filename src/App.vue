<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue';
import { ApolloClients } from '@vue/apollo-composable';
import { apolloClients } from './boot/apollo';

export default defineComponent({
  name: 'App',
  setup() {
    provide(ApolloClients, apolloClients);
    return {};
  },
});
</script>
