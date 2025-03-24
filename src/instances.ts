import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
} from "axios";
import { io } from "socket.io-client";
import type { ISafeForm } from "@/form";

export declare interface INabiiAxiosInstance extends AxiosInstance {
	/**
	 * Overrides the {@link axios.post} method to enforce the usage of `useFormData`
	 * function if the data object contains an {@link INabiiFile}.
	 *
	 * *If it contains an {@link INabiiFile}, it must use `useFormData` If not, TypeScript will infer the type as {@link IFormErrorBrand}*
	 *
	 * @template T - The expected response type.
	 * @template TResponse - The Axios response type.
	 * @template TData - The type of the data object.
	 * @param {string} url - The URL to send the request to.
	 * @param {ISafeForm<TData>} data - The data to send with the request. If it contains an {@link INabiiFile}, it must use `useFormData` If not, TypeScript will infer the type as {@link IFormErrorBrand}.
	 * @param {AxiosRequestConfig} config - The Axios request configuration.
	 * @returns {Promise<TResponse>} - The Axios response promise.
	 */
	post<T = unknown, TResponse = AxiosResponse<T>, TData = object>(
		url: string,
		data?: ISafeForm<TData>,
		config?: AxiosRequestConfig,
	): Promise<TResponse>;
	/**
	 * Overrides the {@link axios.patch} method to enforce the usage of `useFormData`
	 * function if the data object contains an {@link INabiiFile}.
	 *
	 * *If it contains an {@link INabiiFile}, it must use `useFormData` If not, TypeScript will infer the type as {@link IFormErrorBrand}*
	 *
	 * @template T - The expected response type.
	 * @template TResponse - The Axios response type.
	 * @template TData - The type of the data object.
	 * @param {string} url - The URL to send the request to.
	 * @param {ISafeForm<TData>} data - The data to send with the request. If it contains an {@link INabiiFile}, it must use `useFormData` If not, TypeScript will infer the type as {@link IFormErrorBrand}.
	 * @param {AxiosRequestConfig} config - The Axios request configuration.
	 * @returns {Promise<TResponse>} - The Axios response promise.
	 */
	patch<T = unknown, TResponse = AxiosResponse<T>, TData = object>(
		url: string,
		data?: ISafeForm<TData>,
		config?: AxiosRequestConfig,
	): Promise<TResponse>;
}

export class Axios {
	/**
	 * Axios WEB Client for Nabii v1 API
	 */
	static v1: INabiiAxiosInstance = axios.create();
}

export class SocketIo {
	/**
	 * Axios WEB socket Client for Nabii v1 API
	 */
	static v1 = (...config: Parameters<typeof io>): ReturnType<typeof io> =>
		io(...config);
}
