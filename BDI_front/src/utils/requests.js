const baseURL = 'http://localhost:3000/api/v1/'

async function getData(callback, endpoint) {

    try {

        let headers = {
            "Content-Type": "application/json",
        }

        if (sessionStorage.getItem("token")) {
            headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
        }

        let response = await fetch(baseURL + endpoint, {
            method: "GET",
            headers: headers,
        });

        if (response.status === 401) {
            sessionStorage.clear();
        }
        callback(await response.json());

    } catch (error) {
        console.log(error);
        return ;
    }
}

async function getData2(endpoint) {
  try {
    let headers = {
      "Content-Type": "application/json",
    };

    if (sessionStorage.getItem("token")) {
      headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
    }

    let response = await fetch(baseURL + endpoint, {
      method: "GET",
      headers: headers,
    });

    if (response.status === 401) {
      sessionStorage.clear();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function postData(callback, endpoint, data) {
    try {

        let headers = {
            "Content-Type": "application/json",
        }

        if (sessionStorage.getItem("token")) {
            headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
        }

        let response = await fetch(baseURL + endpoint, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (response.status === 401) {
            sessionStorage.clear();
        }
        callback(await response.json());

    } catch (error) {
        console.log(error);
        return ;
    }
}

async function postImage(callback, postId, image) {
    try {
        const formData = new FormData();
        formData.append("file", image)

        let headers = {}

        if (sessionStorage.getItem("token")) {
            headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
        }

        fetch(baseURL + "posts/" + postId + "/upload", {
            method: "POST",
            body: formData,
            headers: headers,
        }).then((response) => {
            response.json();
        }
        ).then((data) => {
            callback(data);
        }
        ).catch((error) => {
            console.log(error);
        }
        );

    } catch (error) {
        console.log(error);
        return ;
    }
}

async function deleteData(endpoint) {
    try {
        let headers = {
            "Content-Type": "application/json",
        }

        if (sessionStorage.getItem("token")) {
            headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
        }

        let response = await fetch(baseURL + endpoint, {
            method: "DELETE",
            headers: headers,
        });

        if (response.status === 401) {
            sessionStorage.clear();
        }
        return response;

    } catch (error) {
        console.log(error);
        return ;
    }
}

async function putData(callback, endpoint, data) {
    try {
        let headers = {
            "Content-Type": "application/json",
        }

        if (sessionStorage.getItem("token")) {
            headers["Authorization"] = "Bearer " + sessionStorage.getItem("token");
        }

        let response = await fetch(baseURL + endpoint, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(data),
        });

        if (response.status === 401) {
            sessionStorage.clear();
        }
        callback(await response.json());
        return response;

    } catch (error) {

        console.log(error);
        return ;
    }
}


export { getData, getData2, postData, postImage, deleteData, putData };
