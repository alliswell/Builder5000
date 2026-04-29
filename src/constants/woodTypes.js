export const WOOD_TYPES = [
  { id: 'oak',    label: 'Oak',    hex: '#C8A96E' },
  { id: 'walnut', label: 'Walnut', hex: '#4A2E1A' },
  { id: 'cherry', label: 'Cherry', hex: '#8B3A2A' },
  { id: 'maple',  label: 'Maple',  hex: '#E8D5A3' },
  { id: 'pine',   label: 'Pine',   hex: '#D4A053' },
]

export const FINISH_TYPES = [
  { id: 'natural', label: 'Natural',     brightnessMultiplier: 1.0 },
  { id: 'light',   label: 'Light Stain', brightnessMultiplier: 1.15 },
  { id: 'dark',    label: 'Dark Stain',  brightnessMultiplier: 0.70 },
  { id: 'custom',  label: 'Custom',      brightnessMultiplier: null },
]

export const APRON_STYLES = [
  { id: 'standard',   label: 'Standard',        desc: 'Straight boards between legs' },
  { id: 'breadboard', label: 'Breadboard Ends',  desc: 'End-caps on tabletop' },
  { id: 'none',       label: 'None',             desc: 'Open frame' },
]

export const LEG_STYLES = [
  { id: 'square',  label: 'Square'  },
  { id: 'tapered', label: 'Tapered' },
  { id: 'turned',  label: 'Turned'  },
]

export const DEFAULT_CONFIG = {
  width:       60,
  depth:       30,
  height:      30,
  thickness:   1.5,
  legSize:     2,
  woodType:    'oak',
  apronStyle:  'standard',
  legStyle:    'square',
  finish:      'natural',
  customColor: '#C8A96E',
}
