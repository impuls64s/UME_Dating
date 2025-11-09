export const GENDERS = [
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
];


export const bodyTypeOptions = [
    { value: 'average', label: 'Обычное' },
    { value: 'slim', label: 'Худощавое' },
    { value: 'athletic', label: 'Атлетическое' },
    { value: 'full', label: 'Полное' },
    { value: 'muscular', label: 'Мускулистое' },
];


export const userStatuses = {
    ACTIVE: {
      label: 'Активный',
      value: 'active'
    },
    INACTIVE: {
      label: 'Неактивный', 
      value: 'inactive'
    },
    BANNED: {
      label: 'Заблокированный',
      value: 'banned'
    },
    PENDING: {
      label: 'На проверке',
      value: 'pending'
    },
    REJECTED: {
      label: 'Отклоненный',
      value: 'rejected'
    },
    DELETED: {
      label: 'Удаленный',
      value: 'deleted'
    }
  };


export const STORAGE_KEYS = {
  USER_ID: 'userId',
  ACCESS_TOKEN: 'accessToken',
  CACHED_PROFILE: 'cachedProfile',
  PROFILE_LAST_UPDATE: 'profileLastUpdate',
} as const;
