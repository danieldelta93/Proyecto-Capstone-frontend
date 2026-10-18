const Icon = ({ d, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {d}
  </svg>
);

export const IconBox = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M3 8l9-5 9 5-9 5-9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>
    }
  />
);

export const IconCoin = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 8v8M9.5 10a2.5 2.5 0 012.5-1.5h.3a2 2 0 010 4h-.6a2 2 0 000 4h.3A2.5 2.5 0 0017 14" />
      </>
    }
  />
);

export const IconChart = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M4 20V10M11 20V4M18 20v-7" />
        <path d="M2 20h20" />
      </>
    }
  />
);

export const IconChat = (p) => (
  <Icon {...p} d={<path d="M4 5h16v11H8l-4 4V5z" />} />
);

export const IconDoc = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M6 3h9l4 4v14H6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13h6M9 17h6" />
      </>
    }
  />
);

export const IconPlus = (p) => (
  <Icon {...p} d={<path d="M12 5v14M5 12h14" />} />
);

export const IconSearch = (p) => (
  <Icon
    {...p}
    d={
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </>
    }
  />
);

export const IconEdit = (p) => (
  <Icon
    {...p}
    size={16}
    d={
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </>
    }
  />
);

export const IconTrash = (p) => (
  <Icon
    {...p}
    size={16}
    d={
      <>
        <path d="M4 7h16" />
        <path d="M9 7V4h6v3" />
        <path d="M6 7l1 13h10l1-13" />
      </>
    }
  />
);

export const IconClose = (p) => (
  <Icon {...p} size={18} d={<path d="M18 6L6 18M6 6l12 12" />} />
);

export const IconSend = (p) => (
  <Icon
    {...p}
    size={18}
    d={
      <>
        <path d="M22 2L11 13" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" />
      </>
    }
  />
);

export const IconDownload = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M12 4v11" />
        <path d="M7 11l5 5 5-5" />
        <path d="M5 20h14" />
      </>
    }
  />
);

export const IconLogout = (p) => (
  <Icon
    {...p}
    d={
      <>
        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    }
  />
);

export const IconAlert = (p) => (
  <Icon
    {...p}
    size={16}
    d={
      <>
        <path d="M12 9v4" />
        <circle cx="12" cy="16.5" r=".6" fill="currentColor" />
        <path d="M10.3 3.9L2.6 17.2A1.6 1.6 0 004 19.6h16a1.6 1.6 0 001.4-2.4L13.7 3.9a1.6 1.6 0 00-2.7 0z" />
      </>
    }
  />
);

export const IconList = (p) => (
  <Icon
    {...p}
    size={16}
    d={
      <>
        <path d="M8 6h13M8 12h13M8 18h13" />
        <path d="M3 6h.01M3 12h.01M3 18h.01" />
      </>
    }
  />
);

export const IconGrid = (p) => (
  <Icon
    {...p}
    size={16}
    d={
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    }
  />
);

export const IconChevron = (p) => (
  <Icon {...p} size={16} d={<path d="M6 9l6 6 6-6" />} />
);
