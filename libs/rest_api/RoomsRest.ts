import { RoomMember } from "../../domain/RoomMembers";
import { Room } from "../../domain/Rooms";
import { ProtectedAxiosInstance } from "../utils/ProtectedAxiosInstance";

interface RoomsRestResponse<T> {
    status: string;
    data: T;
};

export class RoomsRest {
    axios: ProtectedAxiosInstance;
    constructor(axios: ProtectedAxiosInstance) {
        this.axios = axios;
    }

    async getExploreRooms(): Promise<RoomsRestResponse<Room[]>> {
        return await this.axios.get<RoomsRestResponse<Room[]>>("/api/v1/room/explore").then(response => response.data);
    }

    async join(room_id: string): Promise<void> {
        await this.axios.post<RoomsRestResponse<Room>, { room_id: string }>("/api/v1/room/join", { room_id }).then(response => response.data);
    }

    async create(room: Room): Promise<RoomsRestResponse<Room>> {
        return await this.axios.post<RoomsRestResponse<Room>, { room: Room }>("/api/v1/room/create", { room }).then(response => response.data);
    }

    async leave(room_id: string): Promise<void> {
        await this.axios.post<RoomsRestResponse<any>, { room_id: string }>('/api/v1/room/leave', { room_id }).then(response => response.data);
    }

    async delete(room_id: string): Promise<void> {
        await this.axios.post<RoomsRestResponse<any>, { room_id: string }>('/api/v1/room/delete', { room_id }).then(response => response.data);
    }

    async update(room: Room): Promise<RoomsRestResponse<Room>> {
        return await this.axios.post<RoomsRestResponse<Room>, Room>("/api/v1/room/update", room).then(response => response.data);
    }

    async upload_profile_image(room_id: string, profile_image: File): Promise<Asset> {
        let form = new FormData();
        form.append('profile_image', profile_image);
        form.append('room_id', room_id);
        return await this.axios.post<Asset, FormData>('/api/v1/room/upload_profile_image', form).then(response => response.data);
    }

    async upload_cover_image(room_id: string, cover_image: File): Promise<Asset> {
        let form = new FormData();
        form.append('cover_image', cover_image);
        form.append('room_id', room_id);
        return await this.axios.post<Asset, FormData>('/api/v1/room/upload_cover_image', form).then(response => response.data);
    }

    async getById(room_id: string): Promise<RoomsRestResponse<Room>> {
        return await this.axios.get<RoomsRestResponse<Room>>(`/api/v1/room/${room_id}`).then(response => response.data);
    }

    async getMyRooms(room_id?: string): Promise<RoomsRestResponse<Room[]>> {
        if (room_id) {
            return await this.axios.post<RoomsRestResponse<Room[]>, { room_id: string }>("/api/v1/rooms", { room_id }).then(response => response.data);
        }
        return await this.axios.get<RoomsRestResponse<Room[]>>("/api/v1/rooms").then(response => response.data);
    }

    async getRoomMembers(room_id: string): Promise<RoomsRestResponse<RoomMember[]>> {
        return await this.axios.get<RoomsRestResponse<RoomMember[]>>(`/api/v1/room/${room_id}/members`).then(response => response.data);
    }
};