//this namespace manages the checked locations
let addLocation = (function()
{

    //this function validates the data entered ny the user
    let validate = function ()
    {
        let valErr = new Map();
        let valid = true;
        let errors = {NameErr: "Missing location name", longMissingErr: "Missing longitude", latMissingErr: "Missing latitude", valErr: "Value not in range"}
        let name = document.getElementById("locName").value.trim();
        let long = document.getElementById("long").value.trim();
        let lat = document.getElementById("lat").value.trim();

        if(name == "")
            valErr.set("Name error", errors.NameErr);
        if(long == "")
            valErr.set("Longitude error", errors.longMissingErr);
        if(lat == "")
            valErr.set("Latitude error", errors.latMissingErr);
        if(long > 180 || long < -180)
            valErr.set("Longitude error", errors.valErr);
        if(lat > 90 || lat < -90)
            valErr.set("Latitude error", errors.valErr);
        if(valErr.size > 0)
            valid = false;
        return {valid, valErr}

    };

    //this function tells the user what errors they made in the form via modal
    let errCheck = function (val)
    {
        if(val.valid)
            return;
        else
        {
            let errList = document.createElement("ul");//creat errors unordered list
            errList.classList.add("list-group");
            errList.id = "errList";

            let md = document.getElementById("errors-modal");
            let i;
            for(i of val.valErr)
            {
                let temp = document.createElement("li");
                temp.classList.add("list-group-item");
                temp.classList.add("list-group-item-danger");
                temp.innerHTML = i[0] + ": " + i[1];
                errList.appendChild(temp);
            }
            md.appendChild(errList);
        }
        openDialog();
    };

    //this function creates the remove button
    let rem = function ()
    {
        let btn2 = document.createElement("button");
        btn2.classList.add("btn");
        btn2.classList.add("btn-outline-secondary");
        btn2.innerText = "Remove";
        btn2.addEventListener("click", removeLoc);

        return btn2;
    };

    //this function creates the checkbox
    let checkbox = function()
    {
        let lbl = document.createElement("input");
        lbl.type = "checkbox";
        lbl.classList.add("align-middle");

        return lbl;
    };

    //this function inserts the content in the location element
    let content = function (location)
    {
        let name = document.createElement("label");
        name.classList.add("col-sm-auto");
        name.classList.add("col-form-label");
        name.innerHTML = location.name;

        let lat = document.createElement("input");
        lat.type = "text";
        lat.readOnly = true;
        lat.classList.add("form-control-plaintext");
        lat.value = "Latitude: " + location.latitude;

        let long = document.createElement("input");
        long.type = "text";
        long.readOnly = true;
        long.classList.add("form-control-plaintext");
        long.value = "Longitude: " + location.longitude;

        let col1 = document.createElement("div");
        col1.classList.add("col-sm-auto");
        col1.appendChild(long);

        let col2 = document.createElement("div");
        col2.classList.add("col-sm-auto");
        col2.appendChild(lat);

        let div1 = document.createElement("div");
        div1.classList.add("form-group");
        div1.classList.add("row");
        div1.classList.add("justify-content-between");
        let div2 = document.createElement("div");
        div2.classList.add("form-group");
        div2.classList.add("row");

        div1.appendChild(name);
        div1.appendChild(rem());

        div2.appendChild(col1);
        div2.appendChild(col2);

        return {div1, div2} ;
    };

    //this function creates the location element
    let finalLocation = function (location)
    {
        let li = document.createElement("li");
        li.classList.add("list-group-item");
        li.classList.add("list-group-item-light");
        li.classList.add("d-flex");
        li.classList.add("align-items-center");

        let div = document.createElement("div");
        div.classList.add("container");

        let content = addLocation.createContent(location);

        li.appendChild(addLocation.checkbox());
        div.appendChild(content.div1);
        div.appendChild(content.div2);
        li.appendChild(div);

        document.getElementById("locList").appendChild(li);
        document.getElementById("locName").value = "";
        document.getElementById("long").value = "";
        document.getElementById("lat").value = "";
    };

    return {validate: validate, errCheck: errCheck, remBtn: rem, checkbox: checkbox, createContent: content, createLocation: finalLocation};
})();