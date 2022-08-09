export default function ({ $auth, route }) {
  // If on login page and already logged in, redirect to home page.
  if (route.name === 'login' && $auth.loggedIn) {
    return $auth.redirect('home')
  }

  // Only pages requiring guest role can be accessed by any user.
  if (route.meta?.every((m) => m.roles?.includes('guest'))) {
    return
  }

  // If logged in, can only access routes with the correct role.
  if (
    $auth.loggedIn &&
    route.meta?.every((m) =>
      m.roles?.some((r) => $auth.user.roles?.includes(r))
    )
  ) {
    return
  }

  return $auth.redirect('home')
}
