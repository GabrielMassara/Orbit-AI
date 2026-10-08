import { defineComponent, h, type PropType } from 'vue'
import { icons, type IconName } from './icons'

export default defineComponent({
  name: 'AppIcon',
  props: {
    name: { type: String as PropType<IconName>, required: true },
    size: { type: Number, default: 18 },
    strokeWidth: { type: Number, default: 1.8 }
  },
  setup(props) {
    return () =>
      h(
        'svg',
        {
          width: props.size,
          height: props.size,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': props.strokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          'aria-hidden': 'true'
        },
        icons[props.name].map(([tag, attrs]) => h(tag, attrs))
      )
  }
})
