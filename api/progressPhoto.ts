import axiosInstance from "./axios"


type PhotoView = 'front' | 'side' | 'back'

interface CreateProgressPhotoParams {
    takenAt?: Date
    view: PhotoView
    note?: string
    blurhash?: string
    image: File
}

export const progressPhoToAPI = {
    create: async (params: CreateProgressPhotoParams) =>{
       const formData = new FormData()

       formData.append('image', params.image)

       if(params.takenAt) {
        formData.append('takenAt', params.takenAt.toISOString())
       }
       formData.append('view', params.view)
        if (params.note) {
            formData.append('note', params.note)
        }
        if (params.blurhash) {
            formData.append('blurhash', params.blurhash)
        }

        const response = await axiosInstance.post('/progress-photos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        
        return response.data
    },
    getAll: async () => {
        const response = await axiosInstance.get('/progress-photos')
        return response.data
    }
}