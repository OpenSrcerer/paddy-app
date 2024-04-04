<template>
  <q-item
    clickable
    :tag="!!route ? null : 'a'"
    :target="!!route ? null : '_blank'"
    :href="!!route ? null : link"
    @click.prevent="onRouteLink"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  route?: string;
  icon?: string;
}
const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

const onRouteLink = async () => {
  if (!props.route) return;

  await router.replace(props.route)
}
</script>

<style scoped lang="scss">
</style>
