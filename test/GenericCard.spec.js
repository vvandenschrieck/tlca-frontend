import VueRouter from 'vue-router'
import Vuetify from 'vuetify'

import { createLocalVue, mount } from '@vue/test-utils'

import GenericCard from '@/components/cards/GenericCard.vue'

describe('GenericCard', () => {
  let localVue
  let router
  let vuetify

  beforeEach(() => {
    localVue = createLocalVue()
    const routes = [
      {
        name: 'destination',
        path: '/destination',
        component: { template: '<div>destination</div>' },
      },
      {
        name: 'error-404',
        path: '/404',
        component: { template: '<div>error</div>' },
      },
    ]
    localVue.use(VueRouter)
    router = new VueRouter({ routes })

    vuetify = new Vuetify()
  })

  const mountFunction = (options) => {
    return mount(GenericCard, {
      localVue,
      router,
      vuetify,
      ...options,
    })
  }

  test('is a Vue instance', () => {
    const wrapper = mountFunction({
      propsData: {
        to: { name: 'destination' },
      },
    })
    expect(wrapper.vm).toBeTruthy()
  })

  // test('uses the default banner if none is defined', () => {
  //   const wrapper = mountFunction({
  //     propsData: {
  //       to: { name: 'destination' },
  //     },
  //   })
  //   expect(wrapper.vm.innerBanner).toBe('/default-banner.png')
  // })

  // test('does not use the default banner if one is defined', () => {
  //   const wrapper = mountFunction({
  //     propsData: {
  //       banner: 'my_banner.png',
  //       to: { name: 'destination' },
  //     },
  //   })
  //   expect(wrapper.vm.innerBanner).toBe('my_banner.png')
  // })

  test('contains a clickable card linking to the specified destination', () => {
    const wrapper = mountFunction({
      propsData: {
        to: { name: 'destination' },
      },
    })
    const vCard = wrapper.find('.v-card')
    expect(vCard.exists()).toBe(true)
    expect(vCard.attributes().href).toBe('#/destination')
  })
})
