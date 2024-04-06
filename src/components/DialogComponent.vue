<template>
  <q-dialog v-model="model">
    <q-card>
      <q-card-section class="row items-center">
        <q-icon style="margin-right: 0.5rem; font-size: 1.5rem;" id="dialog_icon" :name="props.icon"/>
        <div style="font-weight: bold" class="text-h6">{{ props.title }}</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="slot-container">
          <slot/>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn class="dialog-button" v-if="!!props.closeButton" :label="props.closeButton.toUpperCase()" v-close-popup />
        <q-btn
          :class="dangerous ? 'dialog-button-dangerous' : 'dialog-button'"
          v-for="button in props.buttons"
          :key="button"
          :label="button.toUpperCase()"
          @click="$emit(button)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
export interface DialogProps {
  title?: string,
  icon?: string,
  closeButton?: string
  buttons?: string[]
  dangerous?: boolean
}
const props = withDefaults(defineProps<DialogProps>(), {
  title: 'Alert',
  icon: 'help_outline',
  buttons: () => [],
  dangerous: true
})

const model = defineModel<boolean>();
</script>

<style scoped lang="scss">
.slot-container {
  margin: 0;
}

.q-card {
  min-width: 25vw;
}

.dialog-button-dangerous {
  color: #ff3030;
  border: #ff3030 1px solid;
}

.dialog-button {
  min-width: 5rem;
  color: ghostwhite;
  border: ghostwhite 1px solid;
}
</style>
