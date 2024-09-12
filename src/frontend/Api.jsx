import Cookie from "js-cookie";

function Call(resource, request) {
  request.headers ??= new Headers();
  request.headers.set("X-CSRFToken", Cookie.get("csrftoken"));
  return fetch(resource, request);
}

export default Call;

class Model {
  constructor(type) {
    this.type = type;
    this.baseUrl = `/api/${type}s/`;
  }

  async call(urlSuffix, method, data, parseJson = true) {
    const request = {
      method: method,
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    };
    const response = await Call(this.baseUrl + urlSuffix, request);
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
    return this.call("", "GET");
  }

  async detail(id) {
    return this.call(`${id}/`, "GET");
  }

  async create(data) {
    return this.call("", "POST", data);
  }

  async update(data) {
    return this.call(`${data.id}/`, "PUT", data);
  }

  async delete(id) {
    const parseJson = false;
    return await this.call(`${id}/`, "DELETE", {}, parseJson);
  }
}

export const Audience = new Model("audience");
export const Conversation = new Model("conversation");
export const Rule = new Model("rule");
