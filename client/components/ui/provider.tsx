"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
// Basic Chakra v3 Provider


export function Provider(props: React.PropsWithChildren) {
  return (
    <ChakraProvider value={defaultSystem}>
      {props.children}
    </ChakraProvider>
  )
}
