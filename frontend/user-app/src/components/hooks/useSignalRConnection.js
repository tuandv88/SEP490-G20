import { useEffect, useState } from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr'
import useStore from '@/data/store'

export const useSignalRConnection = (url) => {
  const [connection, setConnection] = useState(null)
  const [messages, setMessages] = useState([])
  const codeRun = useStore((state) => state.codeRun)
  const codeResponse = useStore((state) => state.codeResponse)

  useEffect(() => {
    const connect = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(url)
        .withAutomaticReconnect()
        .build()

      newConnection.on('RequestUserCode', async () => {
        console.log('Server requested code from client.')

        let promise = new Promise(async (resolve, reject) => {
          try {
            const codeDto = await requestUserCode()
            resolve(codeDto)
          } catch (error) {
            reject(error)
          }
        })

        return promise
      })

      newConnection.on('ReceiveMessage', (message) => {
        setMessages((prevMessages) => [...prevMessages, message])
      })

      newConnection.onclose(() => {
        console.log('Connection closed. Attempting to reconnect...')
      })

      newConnection.onreconnecting(() => {
        console.log('Reconnecting...')
      })

      newConnection.onreconnected((connectionId) => {
        console.log(`Reconnected. Connection ID: ${connectionId}`)
      })

      try {
        await newConnection.start()
        console.log('Connected to SignalR server with Connection ID:', newConnection.connectionId)
        setConnection(newConnection)
      } catch (error) {
        console.error('Connection failed: ', error)
      }
    }

    connect()

    return () => {
      if (connection) {
        connection.stop().then(() => {
          console.log('Connection stopped.')
        })
      }
    }
  }, [url])

  const requestUserCode = () => {
    return new Promise((resolve) => {
      const codeDto = {
        SolutionCode: codeRun.toString(),
        SubmissionResult: codeResponse.toString()
      }
      resolve(codeDto)
    })
  }

  return { connection, messages }
}