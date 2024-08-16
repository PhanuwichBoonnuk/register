import {
  animation,
  trigger,
  transition,
  animate,
  style,
  query,
} from '@angular/animations';

export const fadeAnimation = animation([
  query(':enter', [style({ opacity: 0 })], { optional: true }),
  query(
    ':leave',
    [style({ opacity: 1 }), animate('.2s ease', style({ opacity: 0 }))],
    { optional: true }
  ),
  query(
    ':enter',
    [style({ opacity: 0 }), animate('.2s ease', style({ opacity: 1 }))],
    { optional: true }
  ),
]);

export const fadeInAnimation = animation([
  style({ opacity: 0 }),
  animate('.2s ease', style({ opacity: 1 })),
]);
