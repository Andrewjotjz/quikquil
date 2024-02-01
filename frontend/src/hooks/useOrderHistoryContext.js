import { OrderHistoryContext } from "../contexts/OrderHistoryContext"
import { useContext } from "react"

export const useOrderHistoryContext = () => {
  const context = useContext(OrderHistoryContext)

  if(!context) {
    throw Error('useOrderHistoryContext must be used inside a OrderHistoryContextProvider')
  }

  return context
}