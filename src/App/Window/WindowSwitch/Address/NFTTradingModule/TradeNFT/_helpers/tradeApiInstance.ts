import axios, { AxiosInstance } from "axios";

const TREASURY_MINT = 'So11111111111111111111111111111111111111112';

const instance: AxiosInstance = axios.create({
  baseURL: `/playdust-api/auction-house/${TREASURY_MINT}`,
});

export default instance;