import Cookie from 'js-cookie';

export default function (resource, request) {
    request.headers ??= new Headers();
    request.headers.set("X-CSRFToken", Cookie.get("csrftoken"));
    return fetch(resource, request);
}
