import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, CycleState, CyclesReducer } from '../reducers/cycles/reducer'
import {
  addNewCycleAction,
  clearActiveCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'
import { produce } from 'immer'

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number | 0
  markCurrentCycleAsFinished: () => void
  clearActiveCycle: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cyclesState, dispatch] = useReducer(
    CyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )
      if (storedStateAsJSON) {
        const dataParsed = JSON.parse(storedStateAsJSON) as CycleState
        const formatedData = {
          ...dataParsed,
          cycles: produce(dataParsed.cycles, (draft) => {
            draft.forEach((cycle) => {
              const { stardDate, interruptedDate, finishedDate } = cycle
              if (stardDate) {
                cycle.stardDate = new Date(stardDate)
              }
              if (interruptedDate) {
                cycle.interruptedDate = new Date(interruptedDate)
              }
              if (finishedDate) {
                cycle.finishedDate = new Date(finishedDate)
              }
            })
          }),
        }

        return formatedData
      }
      return initialState
    },
  )
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.stardDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])
  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null);

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
    // setCycles((state) => {
    //   const newCycles = state.map(cycle => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   });
    //   console.log('new cycles ', newCycles)
    //   return newCycles
    // });
  }

  function clearActiveCycle() {
    // setActiveCycleId(null);
    dispatch(clearActiveCycleAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())
    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      stardDate: new Date(),
    }
    dispatch(addNewCycleAction(newCycle))
    // setCycles((state) => [...state, newCycle]);
    // setActiveCycleId(id);
    setAmountSecondsPassed(0)
  }

  function interruptCycle() {
    dispatch(interruptCurrentCycleAction())
    // setCycles((state) => {
    //   const newCycles = state.map(cycle => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   });
    //   console.log('new cycles ', newCycles)
    //   return newCycles
    // });
    // setActiveCycleId(null);
    console.log(cyclesState)
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        clearActiveCycle,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
