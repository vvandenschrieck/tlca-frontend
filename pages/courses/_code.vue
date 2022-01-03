<template>
  <div v-if="course">
    <v-card flat color="grey lighten-3" class="my-2">
      <v-breadcrumbs divider="/" :items="navItems" class="py-2"></v-breadcrumbs>
    </v-card>
    <h2>{{ course.name }}</h2>
    <v-row>
      <v-col cols="12" md="9">
        <v-card>
        <v-tabs v-model="currentTab" show-arrows>
          <v-tab>{{ $t('course.description') }}</v-tab>
          <v-tab>{{ $t('course.competencies') }}</v-tab>
          <v-tab v-if="course.schedule">{{ $t('course.schedule._') }}</v-tab>
          <v-tab v-if="course.colophon">{{ $t('course.colophon') }}</v-tab>
        </v-tabs>
        <v-card-text class="text--primary">
          <v-tabs-items v-model="currentTab">
            <v-tab-item>
              <div v-html="course.description"></div>
            </v-tab-item>
            <v-tab-item>
              <competency-list :items="course.competencies" />
            </v-tab-item>
            <v-tab-item v-if="course.schedule">
              <v-timeline>
                <v-timeline-item v-for="(event, i) in schedule" :key="i" small right :color="event.time.isAfter() ? 'grey' : undefined">
                  <span slot="opposite">{{ $t(`course.schedule.${event.description}`) }}</span>
                  {{ event.time.format('llll') }}
                </v-timeline-item>
              </v-timeline>
            </v-tab-item>
            <v-tab-item v-if="course.colophon">
              <div v-html="course.colophon"></div>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" :order="$vuetify.breakpoint.smAndDown ? 'first' : undefined">
        <info-panel :title="$t('global.information')" icon="mdi-information" :items="infoItems" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { gql } from 'graphql-tag';

export default {
  name: 'CoursePage',
  data() {
    return {
      currentTab: 'competencies'
    };
  },
  computed: {
    infoItems() {
      const items = [];
      if (this.course.field) {
        items.push({
          icon: 'mdi-school',
          text: this.course.field,
          tooltip: this.$t('course.field')
        });
      }
      if (this.course.language) {
        items.push({
          icon: 'mdi-message',
          text: this.course.language,
          tooltip: this.$t('course.language')
        });
      }
      return items;
    },
    navItems() {
      return [{
        text: this.$tc('global.spaces.home'),
        exact: true,
        to: { name: 'index' }
      }, {
        text: this.$tc('course._', 2),
        exact: true,
        to: { name: 'courses' }
      }, {
        text: this.$route.params.code
      }];
    },
    schedule() {
      const schedule = [];
      for (const event in this.course.schedule) {
        if (['registrationsStart', 'registrationsEnd', 'start', 'end', 'evaluationsEnd'].includes(event)) {
          schedule.push({
            time: this.$moment(this.course.schedule[event]),
            description: event
          });
        }
      }
      schedule.sort((a, b) => a.time - b.time);
      return schedule;
    }
  },
  apollo: {
    course: {
      query: gql`query Course($code: String!) {
        course(code: $code) {
          code
          colophon
          competencies {
            competency {
              code
              description
              name
            }
            category
            subcategory
          }
          description
          field
          language
          name
          schedule {
            registrationsStart
            registrationsEnd
            start
            end
            evaluationsEnd
          }
          type
        }
      }`,
      variables() {
        return {
          code: this.$route.params.code
        };
      }
    }
  }
}
</script>
