import axiosClient from "./axios";

export const userApi = {
    getProfile(){
        return axiosClient.get("/users/profile");
    }
}