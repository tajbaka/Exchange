import axios from 'axios';
// import { ENV } from 'react-native-dotenv';

export let axiosInstance: any;

export function createAxiosInstance(){
    // if(ENV === 'development'){
        // axiosInstance = axios.create({
        //     baseURL: 'http://ec2-3-17-138-247.us-east-2.compute.amazonaws.com:3000',
        //     timeout: 5000
        // });
    // }
    // else {
        axiosInstance = axios.create({
            baseURL: 'http://ec2-18-189-253-90.us-east-2.compute.amazonaws.com:3000',
            timeout: 5000
        });
    // }
}