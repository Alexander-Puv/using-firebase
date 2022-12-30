import { DocumentData, doc, onSnapshot } from 'firebase/firestore'
import { useContext, useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseContext } from '../MainConf'
import { ChatContext } from '../reducer/ChatContext'
import { ChatCard } from './UI'

const UserChats = () => {
  const {auth, firestore} = useContext(FirebaseContext)
  const [user] = useAuthState(auth)
  const [chats, setChats] = useState<DocumentData | null | undefined>(null)
  const chatContext = useContext(ChatContext)

  useEffect(() => {
    if (user) {
      const unsub = onSnapshot(doc(firestore, "userChats", user.uid), (doc) => {
        setChats(doc.data())
      });

      return () => {
        unsub()
      }
    }
  }, [user?.uid])

  return <>
    {chats && Object.entries(chats).sort((a, b) => b[1].date - a[1].date).map(chat =>
      <ChatCard
        displayName={chat[1].userInfo.displayName}
        photoURL={chat[1].userInfo.photoURL}
        content={
          chat[1].lastMessage ? // if there is last message
          chat[1].lastMessage.value ?? // check is there text
          chat[1].lastMessage.audioData // otherwise check is there audio
          : '' // if no messages - no comments
        }
        anotherUser={chat[1].userInfo}
        chosen={chatContext?.state.user?.uid === chat[1].userInfo.uid ? true : false}
        key={chat[0]}
      />
    )}
  </>
}

export default UserChats