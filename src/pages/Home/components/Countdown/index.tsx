import { useContext, useEffect } from 'react'
import { CountdownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    clearActiveCycle,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CyclesContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  const currentMinutesAmount = Math.floor(currentSeconds / 60)
  const secondsAMount = currentSeconds % 60
  const minutes = String(currentMinutesAmount).padStart(2, '0')
  const seconds = String(secondsAMount).padStart(2, '0')

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const difference = differenceInSeconds(
          new Date(),
          new Date(activeCycle.stardDate),
        )
        if (difference <= totalSeconds) {
          setSecondsPassed(
            differenceInSeconds(new Date(), activeCycle.stardDate),
          )
        } else {
          markCurrentCycleAsFinished()
          clearInterval(interval)
          clearActiveCycle()
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    markCurrentCycleAsFinished,
    clearActiveCycle,
    setSecondsPassed,
  ])

  useEffect(() => {
    if (activeCycle) document.title = `Ignite Timer - ${minutes}:${seconds}`
    else {
      document.title = `Ignite Timer`
    }
    return () => {}
  }, [minutes, seconds, activeCycle])

  return (
    <CountdownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountdownContainer>
  )
}
