Promise.reject(4)
    .then((value) => {
        console.log("p1 value", value);
        return value;
    })
    .then((value) => {
        console.log("p2 value", value);
        return value;
    })
    .then((value) => {
        console.log("p3 value", value);
        return value;
    })
    .catch((reason) => {
        console.log(reason);
    });
