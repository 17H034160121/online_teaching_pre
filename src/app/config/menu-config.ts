export interface Menu {
  name: string;
  url: string;
  icon?: string;
}

export const indexMenu: Menu[] = [
  { name: '首页', url: '/home' },
  { name: '直播', url: '/live' },
  { name: '课程', url: '/course' },
  { name: '问答', url: '/solution' },
];

export const userCenterMenu: Menu[] = [
  { name: '我的消息', url: '/user/my_message' },
  { name: '我的课程', url: '/user/my_course' },
  { name: '我的提问', url: '/user/my_question' }
];

export const adminMenu: Menu[] = [
  { name: '网站首页', url: '/admin/home_page', icon: 'home' },
  { name: '用户管理', url: '/admin/user_manage', icon: 'user' },
  { name: '院系管理', url: '/admin/category_manage', icon: 'appstore' },
  { name: '班级管理', url: '/admin/class_manage', icon: 'appstore' },
  { name: '课程管理', url: '/admin/course_manage', icon: 'file-text' },
  { name: '直播管理', url: '/admin/live_manage', icon: 'video-camera' },
  { name: '修改信息', url: '/admin/edit_info', icon: 'form' },
  { name: '关于网站', url: '/admin/about_website', icon: 'link' }
];
