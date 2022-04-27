import dynamic from 'next/dynamic'

// react-json-view can only be client render since it uses window
export const DynamicReactJson = dynamic(import('react-json-view'), {
  ssr: false,
})
