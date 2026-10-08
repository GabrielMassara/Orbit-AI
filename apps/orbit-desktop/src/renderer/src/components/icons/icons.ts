type Attrs = Record<string, string | number>
type Shape = [tag: string, attrs: Attrs]

const path = (d: string): Shape => ['path', { d }]
const circle = (cx: number, cy: number, r: number, attrs: Attrs = {}): Shape => [
  'circle',
  { cx, cy, r, ...attrs }
]
const rect = (x: number, y: number, width: number, height: number, rx: number): Shape => [
  'rect',
  { x, y, width, height, rx }
]

export const icons = {
  plus: [path('M12 5v14M5 12h14')],
  'chevron-down': [path('M6 9l6 6 6-6')],
  sidebar: [rect(3, 4, 18, 16, 2.5), path('M9 4v16')],
  paperclip: [
    path(
      'M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66L9.41 17.41a2 2 0 01-2.83-2.83l8.49-8.48'
    )
  ],
  'arrow-up': [path('M12 19V5M5 12l7-7 7 7')],
  stop: [
    ['rect', { x: 5, y: 5, width: 14, height: 14, rx: 3, fill: 'currentColor', stroke: 'none' }]
  ],
  more: [
    circle(5, 12, 1.8, { fill: 'currentColor', stroke: 'none' }),
    circle(12, 12, 1.8, { fill: 'currentColor', stroke: 'none' }),
    circle(19, 12, 1.8, { fill: 'currentColor', stroke: 'none' })
  ],
  pencil: [path('M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z')],
  tag: [
    path('M20.59 13.41L13.42 20.58a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z'),
    path('M7 7h.01')
  ],
  trash: [
    path('M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3m2 0v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z')
  ],
  fork: [path('M6 3v12'), circle(18, 6, 3), circle(6, 18, 3), path('M18 9a9 9 0 01-9 9')],

  'shield-check': [
    path('M12 3l7 3v6c0 4.5-3 8.25-7 9-4-.75-7-4.5-7-9V6l7-3z'),
    path('M9.5 12l1.8 1.8L14.5 10')
  ],
  bolt: [path('M13 2L3 14h9l-1 8 10-12h-9l1-8z')],
  'clipboard-list': [
    path('M9 2h6a1 1 0 011 1v1H8V3a1 1 0 011-1z'),
    rect(6, 4, 12, 17, 2),
    path('M9 11h6M9 15h4')
  ],
  'bell-off': [
    path('M8 8a4 4 0 018 0c0 4 2 5 2 5H6s2-1 2-5z'),
    path('M10 17a2 2 0 004 0'),
    path('M3 3l18 18')
  ],
  infinity: [
    path(
      'M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.988-8-13.084-8-5.096 0-5.096 8 0 8 5.096 0 7.989-8 13.084-8z'
    )
  ],

  eye: [path('M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z'), circle(12, 12, 3)],
  'folder-edit': [
    path('M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z'),
    path('M14.5 12.5l3-3 2 2-3 3H14.5v-2z')
  ],
  'lock-open': [rect(5, 11, 14, 9, 2), path('M8 11V7a4 4 0 017.75-1.5')]
} satisfies Record<string, Shape[]>

export type IconName = keyof typeof icons
