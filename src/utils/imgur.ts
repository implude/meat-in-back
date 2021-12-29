import axios from 'axios';
import FormData from "form-data"

export const img2uri = async (content: string) => {
    const data = new FormData()
    data.append('image', content)
    try {
        return (await axios({
            method: 'POST',
            url: 'https://api.imgur.com/3/image',
            headers: {
                'Authorization': 'Client-ID d530e998cdd73f6',
                ...data.getHeaders()
            },
            data
        })).data.data.link
    } catch (e) {
        console.log(e)
    }
}
