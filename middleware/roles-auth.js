export default function ({ $auth, route }) {
  // Only pages requiring guest role can be accessed by any user
  if (route.meta?.every((m) => m.roles?.includes('guest'))) {
    return
  }

  // If logged in, can only access routes with the correct role
  if (
    $auth.loggedIn &&
    route.meta?.every((m) =>
      m.roles?.some((r) => $auth.user.roles?.includes(r))
    )
  ) {
    return
  }

  return $auth.redirect('login')
}
