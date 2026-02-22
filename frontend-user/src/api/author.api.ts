import axiosClient from "./axios"


export const authorApi = {
    getAllAuthor(){
        return axiosClient.get("/authors")
    },
    getAuthorOfBook(id:number){
        return axiosClient.get(`/author/detail-author/${id}`)
    }

}