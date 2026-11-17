import request from "@/utils/request";

class UserManagementAPI {
  static getPage(params: UserPageQuery) {
    return request<any, PageResult<UserRecord>>({
      url: "/api/v1/users",
      method: "get",
      params,
    });
  }

  static create(data: UserPayload) {
    return request<any, UserRecord>({
      url: "/api/v1/users",
      method: "post",
      data,
    });
  }

  static update(id: number, data: UserPayload) {
    return request<any, UserRecord>({
      url: `/api/v1/users/${id}`,
      method: "put",
      data,
    });
  }

  static updateStatus(id: number, enabled: boolean) {
    return request<any, UserRecord>({
      url: `/api/v1/users/${id}/status`,
      method: "patch",
      data: { enabled },
    });
  }

  static delete(id: number) {
    return request<void>({
      url: `/api/v1/users/${id}`,
      method: "delete",
    });
  }
}

export default UserManagementAPI;

export interface PageResult<T> {
  list: T[];
  total: number;
}

export interface UserPageQuery {
  page: number;
  size: number;
  keyword?: string;
  status?: "enabled" | "disabled";
  role?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserPayload {
  name: string;
  username: string;
  email: string;
  phone?: string;
  department: string;
  role: string;
  enabled: boolean;
}

export interface UserRecord extends UserPayload {
  id: number;
  createdAt: string;
  lastActive: string;
}
