<template>
  <v-snackbar
    v-if="message"
    v-stream:input="input$"
    :value="snackbar"
    :timeout="timeout"
    :color="message.type"
    top
  >
    {{ message.text }}
    <template #action="{ attrs }">
      <v-btn v-stream:click="close$" icon v-bind="attrs">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import { merge, NEVER, of } from 'rxjs'
import {
  concatMap,
  delay,
  filter,
  mapTo,
  pluck,
  takeUntil,
} from 'rxjs/operators'

export default {
  name: 'NotificationDisplayer',
  data() {
    return {
      timeout: 2000,
    }
  },
  domStreams: ['close$', 'input$'],
  mounted() {
    this.$notificationManager.setHandler(this.globalErrors)
  },
  subscriptions() {
    const snackbarClose$ = merge(
      this.close$.pipe(mapTo(false)),
      this.input$.pipe(
        pluck('event'),
        pluck('msg'),
        filter((msg) => !msg)
      )
    )
    const message$ = this.globalErrors$.pipe(
      filter((msg) => !!msg),
      concatMap((msg) =>
        merge(of(msg), NEVER.pipe(takeUntil(snackbarClose$.pipe(delay(500)))))
      )
    )

    const snackbar$ = merge(message$.pipe(mapTo(true)), snackbarClose$)

    return {
      message: message$,
      snackbar: snackbar$,
    }
  },
  observableMethods: ['globalErrors'],
}
</script>
