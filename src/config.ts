import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: 'Nyctivoe Blog',
  subtitle: 'Home',
  lang: 'en', // 'en', 'zh_CN', 'zh_TW', 'ja'
  themeColor: {
    hue: 80, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false, // Hide the theme color picker for visitors
  },
  banner: {
    enable: false,
    src: 'assets/images/demo-banner.png', // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: 'center', // Equivalent to object-position, defaults center
  },
  favicon: [
    // Leave this array empty to use the default favicon
    {
      src: '/favicon/code2.png', // Path of the favicon, relative to the /public directory
    },
  ],
}

export const navBarConfig: NavBarConfig = {
  // navbar config at top
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    // {
    //   name: 'GitHub',
    //   url: 'https://github.com/saicaca/fuwari',     // Internal links should not include the base path, as it is automatically added
    //   external: true,                               // Show an external link icon and will open in a new tab
    // },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/demo-avatar.png', // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: 'Nyctivoe',
  bio: '^_^',
  links: [
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/nyctivoe',
    },
    {
      name: 'Discord',
      icon: 'fa6-brands:discord',
      url: 'https://discordapp.com/users/855604759162912768',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: false,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
