import type { IconType } from 'react-icons/lib';

import { IoDocumentTextOutline, IoHelpCircleOutline } from 'react-icons/io5';
import {
  LuBookMarked,
  LuBookOpen,
  LuBuilding2,
  LuLayoutDashboard,
  LuRadius,
  LuUsers,
} from 'react-icons/lu';
import { PiChalkboardTeacher, PiStudent } from 'react-icons/pi';

import { SubjectName } from '@/types/auth';

type ISubMenu = {
  id: number;
  title: string;
  route: string;
  icon: IconType;
};

type IMenuItem = {
  id: number;
  title: string;
  route?: string;
  icon: IconType;
  object: SubjectName;
  subMenus?: ISubMenu[];
};

export type IMenuGroup = {
  label?: string;
  items: IMenuItem[];
};

export const MENU_GROUPS: IMenuGroup[] = [
  {
    items: [
      {
        id: 0,
        title: 'dashboard',
        route: '/',
        icon: LuLayoutDashboard,
        object: SubjectName.Dashboard,
      },
    ],
  },
  {
    label: 'sidebar.group.academic',
    items: [
      {
        id: 1,
        title: 'students',
        route: '/students',
        icon: PiStudent,
        object: SubjectName.Students,
      },
      {
        id: 4,
        title: 'campuses',
        route: '/campuses',
        icon: LuBuilding2,
        object: SubjectName.Campuses,
      },
      {
        id: 5,
        title: 'programs',
        route: '/programs',
        icon: LuBookMarked,
        object: SubjectName.Programs,
      },
    ],
  },
  {
    label: 'sidebar.group.assessment',
    items: [
      {
        id: 3,
        title: 'tests',
        icon: IoDocumentTextOutline,
        object: SubjectName.Tests,
        route: '/tests',
      },
      {
        id: 1,
        title: 'passages',
        route: '/passages',
        icon: LuBookOpen,
        object: SubjectName.Tests,
      },
      {
        id: 2,
        title: 'questions',
        route: '/questions',
        icon: IoHelpCircleOutline,
        object: SubjectName.Tests,
      },
    ],
  },
  {
    label: 'sidebar.group.hr',
    items: [
      {
        id: 2,
        title: 'teachers',
        route: '/teachers',
        icon: PiChalkboardTeacher,
        object: SubjectName.Teachers,
      },
    ],
  },
  {
    label: 'sidebar.group.access',
    items: [
      {
        id: 6,
        title: 'users',
        route: '/users',
        icon: LuUsers,
        object: SubjectName.Users,
      },
      {
        id: 7,
        title: 'roles',
        route: '/roles',
        icon: LuRadius,
        object: SubjectName.Roles,
      },
    ],
  },
];
