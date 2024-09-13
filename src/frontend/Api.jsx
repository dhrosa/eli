export default {};

class Model {
  constructor(type) {
    this.type = type;
    this.baseUrl = `/api/${type}s/`;
  }

  async call({
    urlSuffix = "",
    method = "GET",
    data = null,
    parseJson = true,
    user = null,
  }) {
    var headers = new Headers({
      "Content-Type": "application/json",
    });
    var body;
    if (method != "GET") {
      headers.append("Authorization", `Token ${user.token}`);
      body = JSON.stringify(data);
    }

    const request = {
      method: method,
      body: body,
      headers: headers,
    };
    const response = await fetch(this.baseUrl + urlSuffix, request);
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

  async detail(id) {
    return this.call({
      urlSuffix: `${id}/`,
    });
  }

  async create(data, user) {
    return this.call({ method: "POST", data: data, user: user });
  }

  async update(data, user) {
    return this.call({
      urlSuffix: `${data.id}/`,
      method: "PUT",
      data: data,
      user: user,
    });
  }

  async delete(id, user) {
    return this.call({
      urlSuffix: `${id}/`,
      method: "DELETE",
      data: data,
      parseJson: false,
      user: user,
    });
  }
}

export const Audience = new Model("audience");
export const Conversation = new Model("conversation");
export const Rule = new Model("rule");
