import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';

export default [
  layout('./pages/auth/layout.tsx', [route('login', './pages/auth/login.tsx')]),

  layout('./pages/main/layout.tsx', [
    index('./pages/main/home.tsx'),

    ...prefix('users', [
      index('./pages/users/list.tsx'),
      route('create', './pages/users/create.tsx'),
      route(':id', './pages/users/detail.tsx'),
      route(':id/edit', './pages/users/edit.tsx'),
    ]),

    ...prefix('roles', [
      index('./pages/roles/list.tsx'),
      route('create', './pages/roles/create.tsx'),
      route(':id', './pages/roles/detail.tsx'),
      route(':id/edit', './pages/roles/edit.tsx'),
    ]),

    ...prefix('campuses', [
      index('./pages/campuses/list.tsx'),
      route('create', './pages/campuses/create.tsx'),
      route(':id', './pages/campuses/detail.tsx'),
      route(':id/edit', './pages/campuses/edit.tsx'),
    ]),

    ...prefix('passages', [
      index('./pages/passages/list.tsx'),
      route('create', './pages/passages/create.tsx'),
      route(':id', './pages/passages/detail.tsx'),
      route(':id/edit', './pages/passages/edit.tsx'),
    ]),

    ...prefix('programs', [
      index('./pages/programs/list.tsx'),
      route('create', './pages/programs/create.tsx'),
      route(':id', './pages/programs/detail.tsx'),
      route(':id/edit', './pages/programs/edit.tsx'),
      route(':id/levels/create', './pages/programs/levels/create.tsx'),
      route(':id/levels/:levelId/edit', './pages/programs/levels/edit.tsx'),
    ]),

    ...prefix('students', [
      index('./pages/students/list.tsx'),
      route('create', './pages/students/create.tsx'),
      route(':id', './pages/students/detail.tsx'),
      route(':id/edit', './pages/students/edit.tsx'),
    ]),

    ...prefix('teachers', [
      index('./pages/teachers/list.tsx'),
      route('create', './pages/teachers/create.tsx'),
      route(':id', './pages/teachers/detail.tsx'),
      route(':id/edit', './pages/teachers/edit.tsx'),
    ]),

    ...prefix('tests', [
      index('./pages/tests/list.tsx'),
      route('create', './pages/tests/create.tsx'),
      route(':id/edit', './pages/tests/edit.tsx'),
    ]),

    route('questions', './pages/questions/list.tsx'),
  ]),
] satisfies RouteConfig;
