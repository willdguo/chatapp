import axios from "axios"
const baseUrl = '/api/rooms'

const getRoom = async (roomId) => {
    const response = await axios.get(`${baseUrl}/${roomId}`)
    // console.log(response.data)
    return response.data
}

const addRoom = async(roomData) => {
    const response = await axios.post(baseUrl, roomData)
    console.log("room added")
    console.log(response)
    return response
}


const addMessage = async (roomId, newMessage) => {
    const response = await axios.put(`${baseUrl}/${roomId}`, newMessage)
    return response.data
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    getRoom,
    addRoom,
    addMessage
}