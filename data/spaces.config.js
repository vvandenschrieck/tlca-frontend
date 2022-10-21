export const spaces = [
  {
    title: 'global.spaces.home',
    icon: 'mdi-home',
    to: { name: 'index' },
    sections: [
      { title: 'course._', to: { name: 'courses' } },
      { title: 'program._', to: { name: 'programs' } },
      { title: 'partner._', to: { name: 'partners' } },
    ],
  },
  {
    title: 'global.spaces.manage',
    icon: 'mdi-view-dashboard',
    to: { name: 'manage' },
    roles: ['manager', 'teacher'],
    sections: [
      {
        title: 'competency._',
        to: { name: 'manage-competencies' },
        roles: ['teacher'],
      },
      {
        title: 'course._',
        to: { name: 'manage-courses' },
        roles: ['teacher'],
      },
      {
        title: 'program._',
        to: { name: 'manage-programs' },
        roles: ['teacher'],
      },
      {
        title: 'partner._',
        to: { name: 'manage-partners' },
        roles: ['manager'],
      },
    ],
  },
  {
    title: 'global.spaces.teach',
    icon: 'mdi-human-male-board',
    to: { name: 'teach' },
    roles: ['teacher'],
    sections: [{ title: 'course._', to: { name: 'teach-courses' } }],
  },
  {
    title: 'global.spaces.learn',
    icon: 'mdi-school',
    to: { name: 'learn' },
    roles: ['student'],
    sections: [{ title: 'course._', to: { name: 'learn-courses' } }],
  },
  {
    title: 'global.spaces.admin',
    icon: 'mdi-account-cog',
    to: { name: 'admin' },
    roles: ['admin'],
    sections: [
      { title: 'competency._', to: { name: 'admin-competencies' } },
      { title: 'course._', to: { name: 'admin-courses' } },
      { title: 'instance._', to: { name: 'admin-instances' } },
      { title: 'partner._', to: { name: 'admin-partners' } },
      { title: 'user._', to: { name: 'admin-users' } },
    ],
  },
]
