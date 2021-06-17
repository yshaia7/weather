//this namespace manages the checked locations
let locations = (function()
{
    let checkedLoc = [];

    let addChecked = function(loc)
    {
        checkedLoc.push(loc);
    };

    let clean = function()
    {
        checkedLoc = [];
    };

    let printChecked = function()
    {
        return checkedLoc;
    };

    return {add: addChecked, cl: clean, pr: printChecked};
})();