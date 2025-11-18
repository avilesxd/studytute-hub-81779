import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

/**
 * The function `genId` generates a unique identifier by incrementing a count and converting it to a string.
 * @returns The function `genId` returns the value of `count` converted to a string.
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * The function `addToRemoveQueue` adds a toast to a removal queue with a delay before removing it.
 * @param {string} toastId - The `toastId` parameter is a unique identifier for a toast message. It is used to track and manage individual
 * toast messages in the application.
 * @returns If the `toastId` is found in the `toastTimeouts` set, nothing is returned as the function exits early with a `return` statement. If
 * the `toastId` is not found in the `toastTimeouts` set, a `setTimeout` function is called to remove the toast after a delay, and the
 * `toastId` is added to the `toastTimeouts`
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

/**
 * This TypeScript reducer function handles actions related to managing toasts in the application state.
 * @param {State} state - The `state` parameter in the reducer function represents the current state of your application. It is an object that
 * contains the data that your application needs to keep track of. In the code snippet you provided, the `state` object likely includes a
 * `toasts` array among other properties. The reducer
 * @param {Action} action - The `action` parameter in the `reducer` function represents an object that describes the type of action that needs
 * to be performed. It typically contains a `type` property that specifies the action type and may also include additional data needed to
 * update the state.
 * @returns The reducer function returns the updated state based on the action type provided. Depending on the action type, it performs
 * different operations on the `toasts` array in the state and returns a new state object with the updated `toasts` array.
 */
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

/**
 * The `dispatch` function updates the memory state by applying a reducer function to an action and then notifies all listeners with the
 * updated state.
 * @param {Action} action - An object representing the action that needs to be dispatched.
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

/**
 * The function `toast` creates and manages toast notifications with unique IDs.
 * @param {Toast}  - The `toast` function takes in a `Toast` object as its parameter. The `Toast` object likely contains properties that define
 * the content and behavior of a toast notification, such as message, duration, type, etc.
 * @returns The `toast` function is returning an object with the following properties:
 * - `id`: The unique identifier generated for the toast.
 * - `dismiss`: A function that dispatches an action to dismiss the toast.
 * - `update`: A function that dispatches an action to update the toast with new properties.
 */
function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

/**
 * The `useToast` function in TypeScript is a custom hook that manages toast notifications and their dismissal.
 * @returns The `useToast` function returns an object that includes the current state, a `toast` property, and a `dismiss` function. The
 * `dismiss` function takes an optional `toastId` parameter and dispatches an action of type 'DISMISS_TOAST' with the provided `toastId`.
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
