import { User } from "./UserContext";

export default {};

interface CallArgs {
  urlSuffix?: string;
  method?: string;
  data?: object;
  parseJson?: boolean;
  user?: User;
}

export class Model {
  type: string;
  baseUrl: string;

  constructor(type: string) {
    this.type = type;
    this.baseUrl = `/api/${type}s/`;
  }

  async call({
    urlSuffix = "",
    method = "GET",
    parseJson = true,
    data,
    user,
  }: CallArgs) {
    const headers = new Headers();
    headers.set("Content-Type", "application/json");

    if (user) {
      headers.set("Authorization", `Token ${user.token}`);
    }

    const response = await fetch(this.baseUrl + urlSuffix, {
      method: method,
      headers: headers,
      body: data ? JSON.stringify(data) : null,
    });
    if (!parseJson) {
      return { value: "value" };
    }

    const json = await response.json();
    if (response.ok) {
      return { value: json };
    }
    return { error: json };
  }

  async list() {
    return this.call({});
  }

  async detail(id: string) {
    return this.call({
      urlSuffix: `${id}/`,
    });
  }

  async create(data: any, user: User) {
    return this.call({ method: "POST", data: data, user: user });
  }

  async update(data: any, user?: User) {
    return this.call({
      urlSuffix: `${data.id as string}/`,
      method: "PUT",
      data: data,
      user: user,
    });
  }

  async delete(id: string, user?: User) {
    return this.call({
      urlSuffix: `${id}/`,
      method: "DELETE",
      parseJson: false,
      user: user,
    });
  }
}

export const Audience = new Model("audience");
export const Conversation = new Model("conversation");
export const Rule = new Model("rule");
