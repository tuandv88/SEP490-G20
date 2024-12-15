import { useEffect, useRef, useState } from 'react'
import { HubConnectionBuilder } from '@microsoft/signalr'
import useStore from '@/data/store'
import Cookies from 'js-cookie'

export const useSignalRConnection = (url) => {
  const [connection, setConnection] = useState(null)
  const [messages, setMessages] = useState([])
  const codeRun = useStore((state) => state.codeRun)
  const codeResponse = useStore((state) => state.codeResponse)

  const codeRunRef = useRef(codeRun);

  useEffect(() => {
    codeRunRef.current = codeRun;
  }, [codeRun]);
  
  useEffect(() => {
    const connect = async () => {
      const newConnection = new HubConnectionBuilder()
        .withUrl(url, {
          accessTokenFactory: () => Cookies.get('authToken')
        })
        .withAutomaticReconnect()
        .build()

      newConnection.on('RequestUserCode', async () => {


        let promise = new Promise(async (resolve, reject) => {
          try {
            const codeDto = await requestUserCode(codeRunRef.current)
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
        //console.log('Connection closed. Attempting to reconnect...')
      })

      newConnection.onreconnecting(() => {
        //console.log('Reconnecting...')
      })

      newConnection.onreconnected((connectionId) => {
        //console.log(`Reconnected. Connection ID: ${connectionId}`)
      })

      try {
        await newConnection.start()
       // console.log('Connected to SignalR server with Connection ID:', newConnection.connectionId)
        setConnection(newConnection)
      } catch (error) {
        console.error('Connection failed: ', error)
      }
    }

    connect()

    return () => {
      if (connection) {
        connection.stop().then(() => {
          // console.log('Connection stopped.')
        })
      }
    }
  }, [url])

  const requestUserCode = (codeRun) => {
    return new Promise((resolve) => {
      const codeDto = {
        SolutionCode: codeRun,
        SubmissionResult: 'Success'
      }
      resolve(codeDto)
    })
  }

  return { connection, messages }
}